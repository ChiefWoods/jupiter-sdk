import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface MigrateVaultContractUnitsInstructionAccounts {
    admin: Address;
    vault: Address;
}

export interface MigrateVaultContractUnitsInstructionArgs {
    expectedCurrentContracts: bigint;
    expectedGlobalMaxContracts: bigint;
    expectedPositionMaxContracts: bigint;
}

const MigrateVaultContractUnitsInstructionDataCodec = getStructCodec([
    ['expectedCurrentContracts', getU64Codec()],
    ['expectedGlobalMaxContracts', getU64Codec()],
    ['expectedPositionMaxContracts', getU64Codec()],
]);

export function createMigrateVaultContractUnitsInstruction(
    accounts: MigrateVaultContractUnitsInstructionAccounts,
    args: MigrateVaultContractUnitsInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(MigrateVaultContractUnitsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('f1e70096da309abd', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
