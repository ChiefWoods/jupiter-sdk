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

export interface ExactOutRouteInstructionAccounts {
    tokenProgram: Address;
    userTransferAuthority: Address;
    userSourceTokenAccount: Address;
    userDestinationTokenAccount: Address;
    destinationTokenAccount?: Address;
    sourceMint: Address;
    destinationMint: Address;
    platformFeeAccount?: Address;
    token2022Program?: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ExactOutRouteInstructionArgs {
    routePlan: Array<RoutePlanStepArgs>;
    outAmount: number | bigint;
    quotedInAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
}

function getExactOutRouteInstructionDataEncoder(): Encoder<ExactOutRouteInstructionArgs> {
    return getStructEncoder([
        ['routePlan', getArrayEncoder(getRoutePlanStepEncoder())],
        ['outAmount', getU64Encoder()],
        ['quotedInAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU8Encoder()],
    ]);
}

export function createExactOutRouteInstruction(
    accounts: ExactOutRouteInstructionAccounts,
    args: ExactOutRouteInstructionArgs,
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
    const instructionData = Buffer.from(getExactOutRouteInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d033ef977b2bed5c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
