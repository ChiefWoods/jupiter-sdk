import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findSignerUserPda } from '../pdas/signerUser';

export interface CreateUserInstructionAccounts {
    signer: Address;
    signerUser?: Address;
    referrer?: Address;
    referrerUser?: Address;
    config: Address;
    systemProgram: Address;
}

export async function createCreateUserInstruction(
    accounts: CreateUserInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let signerUser = accounts.signerUser;
    if (!signerUser) {
        const [derived] = await findSignerUserPda(
            {
                signer: accounts.signer,
            },
            programId,
        );
        signerUser = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: signerUser, isSigner: false, isWritable: true },
        accounts.referrer
            ? { pubkey: accounts.referrer, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.referrerUser
            ? { pubkey: accounts.referrerUser, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('6ce38282fc6d4bda', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
