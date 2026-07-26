import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface DeleteOperatorInstructionAccounts {
    operatorAuthority: Address;
    payer: Address;
    operator: Address;
    deletedOperator: Address;
}

export function createDeleteOperatorInstruction(
    accounts: DeleteOperatorInstructionAccounts,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.deletedOperator, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('d054a8748ac96210', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
