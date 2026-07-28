import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';

export interface DeleteBenefactorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    receiver: Address;
    benefactor: Address;
}

export function createDeleteBenefactorInstruction(
    accounts: DeleteBenefactorInstructionAccounts,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.receiver, isSigner: false, isWritable: true },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('d8e354934fb19893', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
