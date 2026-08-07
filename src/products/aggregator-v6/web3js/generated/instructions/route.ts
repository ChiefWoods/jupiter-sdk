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

export const ROUTE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([229, 23, 203, 151, 122, 227, 173, 42]);

export interface RouteInstructionAccounts {
    tokenProgram: Address;
    userTransferAuthority: Address;
    userSourceTokenAccount: Address;
    userDestinationTokenAccount: Address;
    destinationTokenAccount?: Address;
    destinationMint: Address;
    platformFeeAccount?: Address;
    eventAuthority: Address;
    program: Address;
}

export interface RouteInstructionArgs {
    routePlan: Array<RoutePlanStepArgs>;
    inAmount: number | bigint;
    quotedOutAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
}

function getRouteInstructionDataEncoder(): Encoder<RouteInstructionArgs> {
    return getStructEncoder([
        ['routePlan', getArrayEncoder(getRoutePlanStepEncoder())],
        ['inAmount', getU64Encoder()],
        ['quotedOutAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU8Encoder()],
    ]);
}

function getRouteInstructionDataDecoder(): Decoder<RouteInstructionArgs> {
    return getStructDecoder([
        ['routePlan', getArrayDecoder(getRoutePlanStepDecoder())],
        ['inAmount', getU64Decoder()],
        ['quotedOutAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU8Decoder()],
    ]);
}

export interface ParsedRouteInstruction {
    programId: Address;
    accounts: {
        tokenProgram: AccountMeta;
        userTransferAuthority: AccountMeta;
        userSourceTokenAccount: AccountMeta;
        userDestinationTokenAccount: AccountMeta;
        destinationTokenAccount: AccountMeta;
        destinationMint: AccountMeta;
        platformFeeAccount: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: RouteInstructionArgs;
}

export function parseRouteInstruction(instruction: TransactionInstruction): ParsedRouteInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for Route instruction');
    }
    if (!ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Route instruction discriminator mismatch');
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
            destinationMint: instruction.keys[5]!,
            platformFeeAccount: instruction.keys[6]!,
            eventAuthority: instruction.keys[7]!,
            program: instruction.keys[8]!,
        },
        data: getRouteInstructionDataDecoder().decode(instructionData),
    };
}

export function createRouteInstruction(
    accounts: RouteInstructionAccounts,
    args: RouteInstructionArgs,
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
        { pubkey: accounts.destinationMint, isSigner: false, isWritable: false },
        accounts.platformFeeAccount
            ? { pubkey: accounts.platformFeeAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRouteInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ROUTE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
