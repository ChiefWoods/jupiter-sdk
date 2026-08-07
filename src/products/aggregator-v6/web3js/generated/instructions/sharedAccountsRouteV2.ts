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

export const SHARED_ACCOUNTS_ROUTE_V2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    209, 152, 83, 147, 124, 254, 216, 233,
]);

export interface SharedAccountsRouteV2InstructionAccounts {
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

export interface SharedAccountsRouteV2InstructionArgs {
    id: number;
    inAmount: number | bigint;
    quotedOutAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
    positiveSlippageBps: number;
    routePlan: Array<RoutePlanStepV2Args>;
}

function getSharedAccountsRouteV2InstructionDataEncoder(): Encoder<SharedAccountsRouteV2InstructionArgs> {
    return getStructEncoder([
        ['id', getU8Encoder()],
        ['inAmount', getU64Encoder()],
        ['quotedOutAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU16Encoder()],
        ['positiveSlippageBps', getU16Encoder()],
        ['routePlan', getArrayEncoder(getRoutePlanStepV2Encoder())],
    ]);
}

function getSharedAccountsRouteV2InstructionDataDecoder(): Decoder<SharedAccountsRouteV2InstructionArgs> {
    return getStructDecoder([
        ['id', getU8Decoder()],
        ['inAmount', getU64Decoder()],
        ['quotedOutAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU16Decoder()],
        ['positiveSlippageBps', getU16Decoder()],
        ['routePlan', getArrayDecoder(getRoutePlanStepV2Decoder())],
    ]);
}

export interface ParsedSharedAccountsRouteV2Instruction {
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
    data: SharedAccountsRouteV2InstructionArgs;
}

export function parseSharedAccountsRouteV2Instruction(
    instruction: TransactionInstruction,
): ParsedSharedAccountsRouteV2Instruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for SharedAccountsRouteV2 instruction');
    }
    if (
        !SHARED_ACCOUNTS_ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('SharedAccountsRouteV2 instruction discriminator mismatch');
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
        data: getSharedAccountsRouteV2InstructionDataDecoder().decode(instructionData),
    };
}

export function createSharedAccountsRouteV2Instruction(
    accounts: SharedAccountsRouteV2InstructionAccounts,
    args: SharedAccountsRouteV2InstructionArgs,
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
    let data = Buffer.from(getSharedAccountsRouteV2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SHARED_ACCOUNTS_ROUTE_V2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
