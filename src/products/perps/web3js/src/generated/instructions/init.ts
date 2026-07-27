import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getBooleanEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface InitInstructionAccounts {
    upgradeAuthority: Address;
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    perpetualsProgram: Address;
    perpetualsProgramData: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface InitInstructionArgs {
    allowSwap: boolean;
    allowAddLiquidity: boolean;
    allowRemoveLiquidity: boolean;
    allowIncreasePosition: boolean;
    allowDecreasePosition: boolean;
    allowCollateralWithdrawal: boolean;
    allowLiquidatePosition: boolean;
}

function getInitInstructionDataEncoder(): Encoder<InitInstructionArgs> {
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

export function createInitInstruction(
    accounts: InitInstructionAccounts,
    args: InitInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.admin, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetualsProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetualsProgramData, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('dc3bcfec6cfa2f64', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
