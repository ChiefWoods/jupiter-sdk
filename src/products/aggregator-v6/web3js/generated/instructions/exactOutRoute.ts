import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getRoutePlanStepDecoder, getRoutePlanStepEncoder, type RoutePlanStepArgs } from '../types/routePlanStep';

export const EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([208, 51, 239, 151, 123, 43, 237, 92]);

export interface ExactOutRouteInstructionAccounts {
    tokenProgram: Address;
    userTransferAuthority: Address;
    userSourceTokenAccount: Address;
    userDestinationTokenAccount: Address;
    destinationTokenAccount?: Address;
    sourceMint: Address;
    destinationMint: Address;
    platformFeeAccount?: Address;
    token2022Program?: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ExactOutRouteInstructionArgs {
    routePlan: Array<RoutePlanStepArgs>;
    outAmount: number | bigint;
    quotedInAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
}

function getExactOutRouteInstructionDataEncoder(): Encoder<ExactOutRouteInstructionArgs> {
    return getStructEncoder([
        ['routePlan', getArrayEncoder(getRoutePlanStepEncoder())],
        ['outAmount', getU64Encoder()],
        ['quotedInAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU8Encoder()],
    ]);
}

function getExactOutRouteInstructionDataDecoder(): Decoder<ExactOutRouteInstructionArgs> {
    return getStructDecoder([
        ['routePlan', getArrayDecoder(getRoutePlanStepDecoder())],
        ['outAmount', getU64Decoder()],
        ['quotedInAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU8Decoder()],
    ]);
}

export interface ParsedExactOutRouteInstruction {
    programId: Address;
    accounts: {
        tokenProgram: AccountMeta;
        userTransferAuthority: AccountMeta;
        userSourceTokenAccount: AccountMeta;
        userDestinationTokenAccount: AccountMeta;
        destinationTokenAccount: AccountMeta;
        sourceMint: AccountMeta;
        destinationMint: AccountMeta;
        platformFeeAccount: AccountMeta;
        token2022Program: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: ExactOutRouteInstructionArgs;
}

export function parseExactOutRouteInstruction(instruction: TransactionInstruction): ParsedExactOutRouteInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for ExactOutRoute instruction');
    }
    if (!EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ExactOutRoute instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenProgram: instruction.keys[0]!,
            userTransferAuthority: instruction.keys[1]!,
            userSourceTokenAccount: instruction.keys[2]!,
            userDestinationTokenAccount: instruction.keys[3]!,
            destinationTokenAccount: instruction.keys[4]!,
            sourceMint: instruction.keys[5]!,
            destinationMint: instruction.keys[6]!,
            platformFeeAccount: instruction.keys[7]!,
            token2022Program: instruction.keys[8]!,
            eventAuthority: instruction.keys[9]!,
            program: instruction.keys[10]!,
        },
        data: getExactOutRouteInstructionDataDecoder().decode(instructionData),
    };
}

export function createExactOutRouteInstruction(
    accounts: ExactOutRouteInstructionAccounts,
    args: ExactOutRouteInstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.userTransferAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.userSourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userDestinationTokenAccount, isSigner: false, isWritable: true },
        accounts.destinationTokenAccount
            ? { pubkey: accounts.destinationTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.sourceMint, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationMint, isSigner: false, isWritable: false },
        accounts.platformFeeAccount
            ? { pubkey: accounts.platformFeeAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.token2022Program
            ? { pubkey: accounts.token2022Program, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getExactOutRouteInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
