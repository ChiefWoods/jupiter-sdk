import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export interface EscrowCoreNftDepositInstructionAccounts {
    signer: Address;
    signerUser: Address;
    asset: Address;
    collection?: Address;
    mplCoreProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export async function createEscrowCoreNftDepositInstruction(
    accounts: EscrowCoreNftDepositInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.asset, isSigner: false, isWritable: true },
        accounts.collection
            ? { pubkey: accounts.collection, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.mplCoreProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('bee08586bd93475a', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
