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

export const SHARED_ACCOUNTS_ROUTE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([193, 32, 155, 51, 65, 214, 156, 129]);

export interface SharedAccountsRouteInstructionAccounts {
    tokenProgram: Address;
    programAuthority: Address;
    userTransferAuthority: Address;
    sourceTokenAccount: Address;
    programSourceTokenAccount: Address;
    programDestinationTokenAccount: Address;
    destinationTokenAccount: Address;
    sourceMint: Address;
    destinationMint: Address;
    platformFeeAccount?: Address;
    token2022Program?: Address;
    eventAuthority: Address;
    program: Address;
}

export interface SharedAccountsRouteInstructionArgs {
    id: number;
    routePlan: Array<RoutePlanStepArgs>;
    inAmount: number | bigint;
    quotedOutAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
}

function getSharedAccountsRouteInstructionDataEncoder(): Encoder<SharedAccountsRouteInstructionArgs> {
    return getStructEncoder([
        ['id', getU8Encoder()],
        ['routePlan', getArrayEncoder(getRoutePlanStepEncoder())],
        ['inAmount', getU64Encoder()],
        ['quotedOutAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU8Encoder()],
    ]);
}

function getSharedAccountsRouteInstructionDataDecoder(): Decoder<SharedAccountsRouteInstructionArgs> {
    return getStructDecoder([
        ['id', getU8Decoder()],
        ['routePlan', getArrayDecoder(getRoutePlanStepDecoder())],
        ['inAmount', getU64Decoder()],
        ['quotedOutAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU8Decoder()],
    ]);
}

export interface ParsedSharedAccountsRouteInstruction {
    programId: Address;
    accounts: {
        tokenProgram: AccountMeta;
        programAuthority: AccountMeta;
        userTransferAuthority: AccountMeta;
        sourceTokenAccount: AccountMeta;
        programSourceTokenAccount: AccountMeta;
        programDestinationTokenAccount: AccountMeta;
        destinationTokenAccount: AccountMeta;
        sourceMint: AccountMeta;
        destinationMint: AccountMeta;
        platformFeeAccount: AccountMeta;
        token2022Program: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: SharedAccountsRouteInstructionArgs;
}

export function parseSharedAccountsRouteInstruction(
    instruction: TransactionInstruction,
): ParsedSharedAccountsRouteInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for SharedAccountsRoute instruction');
    }
    if (!SHARED_ACCOUNTS_ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SharedAccountsRoute instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            tokenProgram: instruction.keys[0]!,
            programAuthority: instruction.keys[1]!,
            userTransferAuthority: instruction.keys[2]!,
            sourceTokenAccount: instruction.keys[3]!,
            programSourceTokenAccount: instruction.keys[4]!,
            programDestinationTokenAccount: instruction.keys[5]!,
            destinationTokenAccount: instruction.keys[6]!,
            sourceMint: instruction.keys[7]!,
            destinationMint: instruction.keys[8]!,
            platformFeeAccount: instruction.keys[9]!,
            token2022Program: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: getSharedAccountsRouteInstructionDataDecoder().decode(instructionData),
    };
}

export function createSharedAccountsRouteInstruction(
    accounts: SharedAccountsRouteInstructionAccounts,
    args: SharedAccountsRouteInstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.userTransferAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.sourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.programSourceTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.programDestinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.destinationTokenAccount, isSigner: false, isWritable: true },
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
    let data = Buffer.from(getSharedAccountsRouteInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SHARED_ACCOUNTS_ROUTE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
