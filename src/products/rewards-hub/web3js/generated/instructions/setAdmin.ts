import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';

export interface SetAdminInstructionAccounts {
    campaign: Address;
    admin: Address;
    newAdmin: Address;
}

export function createSetAdminInstruction(
    accounts: SetAdminInstructionAccounts,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.newAdmin, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('fba300345bc2bb5c', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
