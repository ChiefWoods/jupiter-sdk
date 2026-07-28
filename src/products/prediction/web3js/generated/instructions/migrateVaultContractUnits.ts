import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface MigrateVaultContractUnitsInstructionAccounts {
    admin: Address;
    vault: Address;
}

export interface MigrateVaultContractUnitsInstructionArgs {
    expectedCurrentContracts: number | bigint;
    expectedGlobalMaxContracts: number | bigint;
    expectedPositionMaxContracts: number | bigint;
}

function getMigrateVaultContractUnitsInstructionDataEncoder(): Encoder<MigrateVaultContractUnitsInstructionArgs> {
    return getStructEncoder([
        ['expectedCurrentContracts', getU64Encoder()],
        ['expectedGlobalMaxContracts', getU64Encoder()],
        ['expectedPositionMaxContracts', getU64Encoder()],
    ]);
}

export function createMigrateVaultContractUnitsInstruction(
    accounts: MigrateVaultContractUnitsInstructionAccounts,
    args: MigrateVaultContractUnitsInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getMigrateVaultContractUnitsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('f1e70096da309abd', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
