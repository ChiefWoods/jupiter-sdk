import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface UpdateOracleInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    newOracle: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateOracleInstructionArgs {
    vaultId: number;
}

function getUpdateOracleInstructionDataEncoder(): Encoder<UpdateOracleInstructionArgs> {
    return getStructEncoder([['vaultId', getU16Encoder()]]);
}

export function createUpdateOracleInstruction(
    accounts: UpdateOracleInstructionAccounts,
    args: UpdateOracleInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.newOracle, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getUpdateOracleInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('7029d112f8e2fcbc', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
