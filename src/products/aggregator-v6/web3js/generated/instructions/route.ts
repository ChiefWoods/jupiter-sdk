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
import { getRoutePlanStepEncoder, type RoutePlanStepArgs } from '../types/routePlanStep';

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

export function createRouteInstruction(
    accounts: RouteInstructionAccounts,
    args: RouteInstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
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
    const instructionData = Buffer.from(getRouteInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e517cb977ae3ad2a', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
