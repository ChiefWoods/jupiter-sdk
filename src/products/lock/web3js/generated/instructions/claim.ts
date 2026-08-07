import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CLAIM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([62, 198, 214, 193, 213, 159, 108, 210]);

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

function getClaimInstructionDataDecoder(): Decoder<ClaimInstructionArgs> {
    return getStructDecoder([['maxAmount', getU64Decoder()]]);
}

export interface ParsedClaimInstruction {
    programId: Address;
    accounts: {
        escrow: AccountMeta;
        escrowToken: AccountMeta;
        recipient: AccountMeta;
        recipientToken: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: ClaimInstructionArgs;
}

export function parseClaimInstruction(instruction: TransactionInstruction): ParsedClaimInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for Claim instruction');
    }
    if (!CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Claim instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            escrow: instruction.keys[0]!,
            escrowToken: instruction.keys[1]!,
            recipient: instruction.keys[2]!,
            recipientToken: instruction.keys[3]!,
            tokenProgram: instruction.keys[4]!,
            eventAuthority: instruction.keys[5]!,
            program: instruction.keys[6]!,
        },
        data: getClaimInstructionDataDecoder().decode(instructionData),
    };
}

export async function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
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
    let data = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
