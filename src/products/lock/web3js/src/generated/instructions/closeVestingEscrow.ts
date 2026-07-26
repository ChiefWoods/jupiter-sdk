import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { RemainingAccountsInfo, remainingAccountsInfoCodec } from '../types/remainingAccountsInfo';
import { findEscrowMetadataPda } from '../pdas/escrowMetadata';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getOptionCodec, getStructCodec } from '@solana/codecs';

export interface CloseVestingEscrowInstructionAccounts {
    escrow: Address;
    escrowMetadata?: Address;
    tokenMint: Address;
    escrowToken: Address;
    creatorToken: Address;
    creator: Address;
    tokenProgram: Address;
    memoProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CloseVestingEscrowInstructionArgs {
    remainingAccountsInfo: RemainingAccountsInfo | null;
}

const CloseVestingEscrowInstructionDataCodec = getStructCodec([
    ['remainingAccountsInfo', getOptionCodec(remainingAccountsInfoCodec)],
]);

export async function createCloseVestingEscrowInstruction(
    accounts: CloseVestingEscrowInstructionAccounts,
    args: CloseVestingEscrowInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrowMetadata = accounts.escrowMetadata;
    if (!escrowMetadata) {
        const [derived] = await findEscrowMetadataPda(
            {
                escrow: accounts.escrow,
            },
            programId,
        );
        escrowMetadata = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: escrowMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.creatorToken, isSigner: false, isWritable: true },
        { pubkey: accounts.creator, isSigner: true, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(CloseVestingEscrowInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('ddb95f878843fc57', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
