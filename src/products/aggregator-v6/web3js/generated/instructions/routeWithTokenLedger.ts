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

export const ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([150, 86, 71, 116, 167, 93, 14, 104]);

export interface RouteWithTokenLedgerInstructionAccounts {
    tokenProgram: Address;
    userTransferAuthority: Address;
    userSourceTokenAccount: Address;
    userDestinationTokenAccount: Address;
    destinationTokenAccount?: Address;
    destinationMint: Address;
    platformFeeAccount?: Address;
    tokenLedger: Address;
    eventAuthority: Address;
    program: Address;
}

export interface RouteWithTokenLedgerInstructionArgs {
    routePlan: Array<RoutePlanStepArgs>;
    quotedOutAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
}

function getRouteWithTokenLedgerInstructionDataEncoder(): Encoder<RouteWithTokenLedgerInstructionArgs> {
    return getStructEncoder([
        ['routePlan', getArrayEncoder(getRoutePlanStepEncoder())],
        ['quotedOutAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU8Encoder()],
    ]);
}

function getRouteWithTokenLedgerInstructionDataDecoder(): Decoder<RouteWithTokenLedgerInstructionArgs> {
    return getStructDecoder([
        ['routePlan', getArrayDecoder(getRoutePlanStepDecoder())],
        ['quotedOutAmount', getU64Decoder()],
        ['slippageBps', getU16Decoder()],
        ['platformFeeBps', getU8Decoder()],
    ]);
}

export interface ParsedRouteWithTokenLedgerInstruction {
    programId: Address;
    accounts: {
        tokenProgram: AccountMeta;
        userTransferAuthority: AccountMeta;
        userSourceTokenAccount: AccountMeta;
        userDestinationTokenAccount: AccountMeta;
        destinationTokenAccount: AccountMeta;
        destinationMint: AccountMeta;
        platformFeeAccount: AccountMeta;
        tokenLedger: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: RouteWithTokenLedgerInstructionArgs;
}

export function parseRouteWithTokenLedgerInstruction(
    instruction: TransactionInstruction,
): ParsedRouteWithTokenLedgerInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for RouteWithTokenLedger instruction');
    }
    if (
        !ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('RouteWithTokenLedger instruction discriminator mismatch');
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
            tokenLedger: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getRouteWithTokenLedgerInstructionDataDecoder().decode(instructionData),
    };
}

export function createRouteWithTokenLedgerInstruction(
    accounts: RouteWithTokenLedgerInstructionAccounts,
    args: RouteWithTokenLedgerInstructionArgs,
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
        { pubkey: accounts.tokenLedger, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRouteWithTokenLedgerInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
