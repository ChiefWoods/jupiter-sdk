import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';
import {
    getArrayEncoder,
    getStructEncoder,
    getU16Encoder,
    getU64Encoder,
    getU8Encoder,
    type Encoder,
} from '@solana/codecs';
import { getRoutePlanStepV2Encoder, type RoutePlanStepV2Args } from '../types/routePlanStepV2';

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

export function createSharedAccountsExactOutRouteV2Instruction(
    accounts: SharedAccountsExactOutRouteV2InstructionAccounts,
    args: SharedAccountsExactOutRouteV2InstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
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
    const instructionData = Buffer.from(getSharedAccountsExactOutRouteV2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3560e5cad8bbfa18', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
