import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import {
    getRemainingAccountsInfoDecoder,
    getRemainingAccountsInfoEncoder,
    type RemainingAccountsInfoArgs,
} from '../types/remainingAccountsInfo';

export const CLAIM_V2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([229, 87, 46, 162, 21, 157, 231, 114]);

export interface ClaimV2InstructionAccounts {
    escrow: Address;
    tokenMint: Address;
    escrowToken?: Address;
    recipient: Address;
    recipientToken: Address;
    memoProgram: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ClaimV2InstructionArgs {
    maxAmount: number | bigint;
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getClaimV2InstructionDataEncoder(): Encoder<ClaimV2InstructionArgs> {
    return getStructEncoder([
        ['maxAmount', getU64Encoder()],
        ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
    ]);
}

function getClaimV2InstructionDataDecoder(): Decoder<ClaimV2InstructionArgs> {
    return getStructDecoder([
        ['maxAmount', getU64Decoder()],
        ['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())],
    ]);
}

export interface ParsedClaimV2Instruction {
    programId: Address;
    accounts: {
        escrow: AccountMeta;
        tokenMint: AccountMeta;
        escrowToken: AccountMeta;
        recipient: AccountMeta;
        recipientToken: AccountMeta;
        memoProgram: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: ClaimV2InstructionArgs;
}

export function parseClaimV2Instruction(instruction: TransactionInstruction): ParsedClaimV2Instruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for ClaimV2 instruction');
    }
    if (!CLAIM_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimV2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            escrow: instruction.keys[0]!,
            tokenMint: instruction.keys[1]!,
            escrowToken: instruction.keys[2]!,
            recipient: instruction.keys[3]!,
            recipientToken: instruction.keys[4]!,
            memoProgram: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            eventAuthority: instruction.keys[7]!,
            program: instruction.keys[8]!,
        },
        data: getClaimV2InstructionDataDecoder().decode(instructionData),
    };
}

export async function createClaimV2Instruction(
    accounts: ClaimV2InstructionAccounts,
    args: ClaimV2InstructionArgs,
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
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.recipient, isSigner: true, isWritable: true },
        { pubkey: accounts.recipientToken, isSigner: false, isWritable: true },
        { pubkey: accounts.memoProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getClaimV2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_V2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
