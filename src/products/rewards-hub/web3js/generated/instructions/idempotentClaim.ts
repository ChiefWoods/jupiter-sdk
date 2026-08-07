import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const IDEMPOTENT_CLAIM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([229, 117, 181, 84, 217, 200, 61, 150]);

export interface IdempotentClaimInstructionAccounts {
    campaign: Address;
    claimStatus: Address;
    from: Address;
    to: Address;
    claimant: Address;
    claimsPubkey: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    program: Address;
    mint: Address;
}

export interface IdempotentClaimInstructionArgs {
    amount: Array<number | bigint>;
    lootboxInfo: Array<number | bigint>;
}

function getIdempotentClaimInstructionDataEncoder(): Encoder<IdempotentClaimInstructionArgs> {
    return getStructEncoder([
        ['amount', getArrayEncoder(getU64Encoder(), { size: 5 })],
        ['lootboxInfo', getArrayEncoder(getU64Encoder(), { size: 5 })],
    ]);
}

function getIdempotentClaimInstructionDataDecoder(): Decoder<IdempotentClaimInstructionArgs> {
    return getStructDecoder([
        ['amount', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ['lootboxInfo', getArrayDecoder(getU64Decoder(), { size: 5 })],
    ]);
}

export interface ParsedIdempotentClaimInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        claimStatus: AccountMeta;
        from: AccountMeta;
        to: AccountMeta;
        claimant: AccountMeta;
        claimsPubkey: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        program: AccountMeta;
        mint: AccountMeta;
    };
    data: IdempotentClaimInstructionArgs;
}

export function parseIdempotentClaimInstruction(instruction: TransactionInstruction): ParsedIdempotentClaimInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for IdempotentClaim instruction');
    }
    if (!IDEMPOTENT_CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('IdempotentClaim instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            claimStatus: instruction.keys[1]!,
            from: instruction.keys[2]!,
            to: instruction.keys[3]!,
            claimant: instruction.keys[4]!,
            claimsPubkey: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            associatedTokenProgram: instruction.keys[8]!,
            program: instruction.keys[9]!,
            mint: instruction.keys[10]!,
        },
        data: getIdempotentClaimInstructionDataDecoder().decode(instructionData),
    };
}

export function createIdempotentClaimInstruction(
    accounts: IdempotentClaimInstructionAccounts,
    args: IdempotentClaimInstructionArgs,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: accounts.claimStatus, isSigner: false, isWritable: false },
        { pubkey: accounts.from, isSigner: false, isWritable: false },
        { pubkey: accounts.to, isSigner: false, isWritable: false },
        { pubkey: accounts.claimant, isSigner: true, isWritable: true },
        { pubkey: accounts.claimsPubkey, isSigner: true, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getIdempotentClaimInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(IDEMPOTENT_CLAIM_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
