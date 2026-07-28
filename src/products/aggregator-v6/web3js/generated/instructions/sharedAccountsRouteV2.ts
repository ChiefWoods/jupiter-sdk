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

export function createSharedAccountsRouteV2Instruction(
    accounts: SharedAccountsRouteV2InstructionAccounts,
    args: SharedAccountsRouteV2InstructionArgs,
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
    const instructionData = Buffer.from(getSharedAccountsRouteV2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d19853937cfed8e9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
