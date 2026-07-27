import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface TransferAdminInstructionAccounts {
    admin: Address;
    newAdmin: Address;
    perpetuals: Address;
}

export function createTransferAdminInstruction(
    accounts: TransferAdminInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.newAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('2af2426ae40a6f9c', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
