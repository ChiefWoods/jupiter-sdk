import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEscrowMetadataPda } from '../pdas/escrowMetadata';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
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

export const CLOSE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([221, 185, 95, 135, 136, 67, 252, 87]);

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
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getCloseVestingEscrowInstructionDataEncoder(): Encoder<CloseVestingEscrowInstructionArgs> {
    return getStructEncoder([['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())]]);
}

function getCloseVestingEscrowInstructionDataDecoder(): Decoder<CloseVestingEscrowInstructionArgs> {
    return getStructDecoder([['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())]]);
}

export interface ParsedCloseVestingEscrowInstruction {
    programId: Address;
    accounts: {
        escrow: AccountMeta;
        escrowMetadata: AccountMeta;
        tokenMint: AccountMeta;
        escrowToken: AccountMeta;
        creatorToken: AccountMeta;
        creator: AccountMeta;
        tokenProgram: AccountMeta;
        memoProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CloseVestingEscrowInstructionArgs;
}

export function parseCloseVestingEscrowInstruction(
    instruction: TransactionInstruction,
): ParsedCloseVestingEscrowInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for CloseVestingEscrow instruction');
    }
    if (!CLOSE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseVestingEscrow instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            escrow: instruction.keys[0]!,
            escrowMetadata: instruction.keys[1]!,
            tokenMint: instruction.keys[2]!,
            escrowToken: instruction.keys[3]!,
            creatorToken: instruction.keys[4]!,
            creator: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            memoProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getCloseVestingEscrowInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCloseVestingEscrowInstruction(
    accounts: CloseVestingEscrowInstructionAccounts,
    args: CloseVestingEscrowInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
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
    let data = Buffer.from(getCloseVestingEscrowInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
