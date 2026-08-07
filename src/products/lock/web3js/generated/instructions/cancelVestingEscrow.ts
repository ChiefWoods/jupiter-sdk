import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findCreatorTokenPda } from '../pdas/creatorToken';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRecipientTokenPda } from '../pdas/recipientToken';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import {
    getRemainingAccountsInfoDecoder,
    getRemainingAccountsInfoEncoder,
    type RemainingAccountsInfoArgs,
} from '../types/remainingAccountsInfo';

export const CANCEL_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([217, 233, 13, 3, 143, 101, 53, 201]);

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

function getCancelVestingEscrowInstructionDataDecoder(): Decoder<CancelVestingEscrowInstructionArgs> {
    return getStructDecoder([['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())]]);
}

export interface ParsedCancelVestingEscrowInstruction {
    programId: Address;
    accounts: {
        escrow: AccountMeta;
        tokenMint: AccountMeta;
        escrowToken: AccountMeta;
        creatorToken: AccountMeta;
        recipientToken: AccountMeta;
        rentReceiver: AccountMeta;
        signer: AccountMeta;
        memoProgram: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CancelVestingEscrowInstructionArgs;
}

export function parseCancelVestingEscrowInstruction(
    instruction: TransactionInstruction,
): ParsedCancelVestingEscrowInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for CancelVestingEscrow instruction');
    }
    if (!CANCEL_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CancelVestingEscrow instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            escrow: instruction.keys[0]!,
            tokenMint: instruction.keys[1]!,
            escrowToken: instruction.keys[2]!,
            creatorToken: instruction.keys[3]!,
            recipientToken: instruction.keys[4]!,
            rentReceiver: instruction.keys[5]!,
            signer: instruction.keys[6]!,
            memoProgram: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            eventAuthority: instruction.keys[9]!,
            program: instruction.keys[10]!,
        },
        data: getCancelVestingEscrowInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCancelVestingEscrowInstruction(
    accounts: CancelVestingEscrowInstructionAccounts,
    args: CancelVestingEscrowInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrowToken = accounts.escrowToken;
    if (!escrowToken) {
        const [derived] = await findEscrowTokenPda({
            escrow: accounts.escrow,
            tokenProgram: accounts.tokenProgram,
            tokenMint: accounts.tokenMint,
        });
        escrowToken = derived;
    }
    let creatorToken = accounts.creatorToken;
    if (!creatorToken) {
        const [derived] = await findCreatorTokenPda({
            escrow: accounts.escrow,
            tokenProgram: accounts.tokenProgram,
            tokenMint: accounts.tokenMint,
        });
        creatorToken = derived;
    }
    let recipientToken = accounts.recipientToken;
    if (!recipientToken) {
        const [derived] = await findRecipientTokenPda({
            escrow: accounts.escrow,
            tokenProgram: accounts.tokenProgram,
            tokenMint: accounts.tokenMint,
        });
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
    let data = Buffer.from(getCancelVestingEscrowInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CANCEL_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
