import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';
import { getArrayEncoder, getStructEncoder, getU16Encoder, getU64Encoder, type Encoder } from '@solana/codecs';
import { getRoutePlanStepV2Encoder, type RoutePlanStepV2Args } from '../types/routePlanStepV2';

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

export function createRouteV2Instruction(
    accounts: RouteV2InstructionAccounts,
    args: RouteV2InstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
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
    const instructionData = Buffer.from(getRouteV2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('bb64facc31c4af14', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
