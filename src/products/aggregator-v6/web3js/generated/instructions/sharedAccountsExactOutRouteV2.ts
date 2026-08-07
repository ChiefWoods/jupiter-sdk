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
import {
    getRoutePlanStepV2Decoder,
    getRoutePlanStepV2Encoder,
    type RoutePlanStepV2Args,
} from '../types/routePlanStepV2';

export const SHARED_ACCOUNTS_EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    53, 96, 229, 202, 216, 187, 250, 24,
]);

export interface SharedAccountsExactOutRouteV2InstructionAccounts {
    programAuthority: Address;
    userTransferAuthority: Address;
    sourceTokenAccount: Address;
    programSourceTokenAccount: Address;
    programDestinationTokenAccount: Address;
    destinationTokenAccount: Address;
    sourceMint: Address;
    destinationMint: Address;
    sourceTokenProgram: Address;
    destinationTokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface SharedAccountsExactOutRouteV2InstructionArgs {
    id: number;
    outAmount: number | bigint;
    quotedInAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
    positiveSlippageBps: number;
    routePlan: Array<RoutePlanStepV2Args>;
}

function getSharedAccountsExactOutRouteV2InstructionDataEncoder(): Encoder<SharedAccountsExactOutRouteV2InstructionArgs> {
    return getStructEncoder([
        ['id', getU8Encoder()],
        ['outAmount', getU64Encoder()],
        ['quotedInAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU16Encoder()],
        ['positiveSlippageBps', getU16Encoder()],
        ['routePlan', getArrayEncoder(getRoutePlanStepV2Encoder())],
    ]);
}

function getSharedAccountsExactOutRouteV2InstructionDataDecoder(): Decoder<SharedAccountsExactOutRouteV2InstructionArgs> {
    return getStructDecoder([
        ['id', getU8Decoder()],
        ['outAmount', getU64Decoder()],
        ['quotedInAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU16Decoder()],
        ['positiveSlippageBps', getU16Decoder()],
        ['routePlan', getArrayDecoder(getRoutePlanStepV2Decoder())],
    ]);
}

export interface ParsedSharedAccountsExactOutRouteV2Instruction {
    programId: Address;
    accounts: {
        programAuthority: AccountMeta;
        userTransferAuthority: AccountMeta;
        sourceTokenAccount: AccountMeta;
        programSourceTokenAccount: AccountMeta;
        programDestinationTokenAccount: AccountMeta;
        destinationTokenAccount: AccountMeta;
        sourceMint: AccountMeta;
        destinationMint: AccountMeta;
        sourceTokenProgram: AccountMeta;
        destinationTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: SharedAccountsExactOutRouteV2InstructionArgs;
}

export function parseSharedAccountsExactOutRouteV2Instruction(
    instruction: TransactionInstruction,
): ParsedSharedAccountsExactOutRouteV2Instruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for SharedAccountsExactOutRouteV2 instruction');
    }
    if (
        !SHARED_ACCOUNTS_EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('SharedAccountsExactOutRouteV2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            programAuthority: instruction.keys[0]!,
            userTransferAuthority: instruction.keys[1]!,
            sourceTokenAccount: instruction.keys[2]!,
            programSourceTokenAccount: instruction.keys[3]!,
            programDestinationTokenAccount: instruction.keys[4]!,
            destinationTokenAccount: instruction.keys[5]!,
            sourceMint: instruction.keys[6]!,
            destinationMint: instruction.keys[7]!,
            sourceTokenProgram: instruction.keys[8]!,
            destinationTokenProgram: instruction.keys[9]!,
            eventAuthority: instruction.keys[10]!,
            program: instruction.keys[11]!,
        },
        data: getSharedAccountsExactOutRouteV2InstructionDataDecoder().decode(instructionData),
    };
}

export function createSharedAccountsExactOutRouteV2Instruction(
    accounts: SharedAccountsExactOutRouteV2InstructionAccounts,
    args: SharedAccountsExactOutRouteV2InstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.userTransferAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.sourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.programSourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.programDestinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.destinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.sourceMint, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationMint, isSigner: false, isWritable: false },
        { pubkey: accounts.sourceTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getSharedAccountsExactOutRouteV2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SHARED_ACCOUNTS_EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
