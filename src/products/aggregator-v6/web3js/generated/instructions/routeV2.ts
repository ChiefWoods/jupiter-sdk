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
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getRoutePlanStepV2Decoder,
    getRoutePlanStepV2Encoder,
    type RoutePlanStepV2Args,
} from '../types/routePlanStepV2';

export const ROUTE_V2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([187, 100, 250, 204, 49, 196, 175, 20]);

export interface RouteV2InstructionAccounts {
    userTransferAuthority: Address;
    userSourceTokenAccount: Address;
    userDestinationTokenAccount: Address;
    sourceMint: Address;
    destinationMint: Address;
    sourceTokenProgram: Address;
    destinationTokenProgram: Address;
    destinationTokenAccount?: Address;
    eventAuthority: Address;
    program: Address;
}

export interface RouteV2InstructionArgs {
    inAmount: number | bigint;
    quotedOutAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
    positiveSlippageBps: number;
    routePlan: Array<RoutePlanStepV2Args>;
}

function getRouteV2InstructionDataEncoder(): Encoder<RouteV2InstructionArgs> {
    return getStructEncoder([
        ['inAmount', getU64Encoder()],
        ['quotedOutAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU16Encoder()],
        ['positiveSlippageBps', getU16Encoder()],
        ['routePlan', getArrayEncoder(getRoutePlanStepV2Encoder())],
    ]);
}

function getRouteV2InstructionDataDecoder(): Decoder<RouteV2InstructionArgs> {
    return getStructDecoder([
        ['inAmount', getU64Decoder()],
        ['quotedOutAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU16Decoder()],
        ['positiveSlippageBps', getU16Decoder()],
        ['routePlan', getArrayDecoder(getRoutePlanStepV2Decoder())],
    ]);
}

export interface ParsedRouteV2Instruction {
    programId: Address;
    accounts: {
        userTransferAuthority: AccountMeta;
        userSourceTokenAccount: AccountMeta;
        userDestinationTokenAccount: AccountMeta;
        sourceMint: AccountMeta;
        destinationMint: AccountMeta;
        sourceTokenProgram: AccountMeta;
        destinationTokenProgram: AccountMeta;
        destinationTokenAccount: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: RouteV2InstructionArgs;
}

export function parseRouteV2Instruction(instruction: TransactionInstruction): ParsedRouteV2Instruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for RouteV2 instruction');
    }
    if (!ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RouteV2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            userTransferAuthority: instruction.keys[0]!,
            userSourceTokenAccount: instruction.keys[1]!,
            userDestinationTokenAccount: instruction.keys[2]!,
            sourceMint: instruction.keys[3]!,
            destinationMint: instruction.keys[4]!,
            sourceTokenProgram: instruction.keys[5]!,
            destinationTokenProgram: instruction.keys[6]!,
            destinationTokenAccount: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getRouteV2InstructionDataDecoder().decode(instructionData),
    };
}

export function createRouteV2Instruction(
    accounts: RouteV2InstructionAccounts,
    args: RouteV2InstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.userTransferAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.userSourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userDestinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.sourceMint, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationMint, isSigner: false, isWritable: false },
        { pubkey: accounts.sourceTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationTokenProgram, isSigner: false, isWritable: false },
        accounts.destinationTokenAccount
            ? { pubkey: accounts.destinationTokenAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRouteV2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ROUTE_V2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
