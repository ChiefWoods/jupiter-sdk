import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface TestInitInstructionAccounts {
    upgradeAuthority: Address;
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface TestInitInstructionArgs {
    allowSwap: boolean;
    allowAddLiquidity: boolean;
    allowRemoveLiquidity: boolean;
    allowIncreasePosition: boolean;
    allowDecreasePosition: boolean;
    allowCollateralWithdrawal: boolean;
    allowLiquidatePosition: boolean;
}

function getTestInitInstructionDataEncoder(): Encoder<TestInitInstructionArgs> {
    return getStructEncoder([
        ['allowSwap', getBooleanEncoder()],
        ['allowAddLiquidity', getBooleanEncoder()],
        ['allowRemoveLiquidity', getBooleanEncoder()],
        ['allowIncreasePosition', getBooleanEncoder()],
        ['allowDecreasePosition', getBooleanEncoder()],
        ['allowCollateralWithdrawal', getBooleanEncoder()],
        ['allowLiquidatePosition', getBooleanEncoder()],
    ]);
}

export function createTestInitInstruction(
    accounts: TestInitInstructionAccounts,
    args: TestInitInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.admin, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getTestInitInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('30335c7a51137029', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
