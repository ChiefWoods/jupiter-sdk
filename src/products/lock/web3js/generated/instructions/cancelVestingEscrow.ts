import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findCreatorTokenPda } from '../pdas/creatorToken';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRecipientTokenPda } from '../pdas/recipientToken';
import { getOptionEncoder, getStructEncoder, type Encoder, type OptionOrNullable } from '@solana/codecs';
import { getRemainingAccountsInfoEncoder, type RemainingAccountsInfoArgs } from '../types/remainingAccountsInfo';

export interface CancelVestingEscrowInstructionAccounts {
    escrow: Address;
    tokenMint: Address;
    escrowToken?: Address;
    creatorToken?: Address;
    recipientToken?: Address;
    rentReceiver: Address;
    signer: Address;
    memoProgram: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CancelVestingEscrowInstructionArgs {
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getCancelVestingEscrowInstructionDataEncoder(): Encoder<CancelVestingEscrowInstructionArgs> {
    return getStructEncoder([['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())]]);
}

export async function createCancelVestingEscrowInstruction(
    accounts: CancelVestingEscrowInstructionAccounts,
    args: CancelVestingEscrowInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrowToken = accounts.escrowToken;
    if (!escrowToken) {
        const [derived] = await findEscrowTokenPda(
            {
                escrow: accounts.escrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        escrowToken = derived;
    }
    let creatorToken = accounts.creatorToken;
    if (!creatorToken) {
        const [derived] = await findCreatorTokenPda(
            {
                escrow: accounts.escrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        creatorToken = derived;
    }
    let recipientToken = accounts.recipientToken;
    if (!recipientToken) {
        const [derived] = await findRecipientTokenPda(
            {
                escrow: accounts.escrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        recipientToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: true },
        { pubkey: escrowToken, isSigner: false, isWritable: true },
        { pubkey: creatorToken, isSigner: false, isWritable: true },
        { pubkey: recipientToken, isSigner: false, isWritable: true },
        { pubkey: accounts.rentReceiver, isSigner: false, isWritable: true },
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCancelVestingEscrowInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d9e90d038f6535c9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
