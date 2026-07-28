import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface ClaimInstructionAccounts {
    escrow: Address;
    escrowToken: Address;
    recipient: Address;
    recipientToken: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ClaimInstructionArgs {
    maxAmount: number | bigint;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([['maxAmount', getU64Encoder()]]);
}

export async function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.recipient, isSigner: true, isWritable: true },
        { pubkey: accounts.recipientToken, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3ec6d6c1d59f6cd2', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
