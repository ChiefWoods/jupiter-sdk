import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GENIEDISTRIBUTOR_PROGRAM_ID } from '..';

export interface SetClawbackReceiverInstructionAccounts {
    campaign: Address;
    newClawbackAccount: Address;
    admin: Address;
}

export function createSetClawbackReceiverInstruction(
    accounts: SetClawbackReceiverInstructionAccounts,
    programId: Address = GENIEDISTRIBUTOR_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.newClawbackAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
    ];
    const data = Buffer.from('99d92214131de54b', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
