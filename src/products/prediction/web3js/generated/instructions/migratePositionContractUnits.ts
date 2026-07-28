import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface MigratePositionContractUnitsInstructionAccounts {
    admin: Address;
    vault: Address;
    position: Address;
    systemProgram: Address;
}

export interface MigratePositionContractUnitsInstructionArgs {
    expectedContracts: number | bigint;
}

function getMigratePositionContractUnitsInstructionDataEncoder(): Encoder<MigratePositionContractUnitsInstructionArgs> {
    return getStructEncoder([['expectedContracts', getU64Encoder()]]);
}

export function createMigratePositionContractUnitsInstruction(
    accounts: MigratePositionContractUnitsInstructionAccounts,
    args: MigratePositionContractUnitsInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getMigratePositionContractUnitsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('87a8fcf52d91c2a0', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
