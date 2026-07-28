import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';

export interface GetExchangePricesInstructionAccounts {
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReserves: Address;
    borrowTokenReserves: Address;
}

export function createGetExchangePricesInstruction(
    accounts: GetExchangePricesInstructionAccounts,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.vaultState, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReserves, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReserves, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('ed8053983415e756', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
