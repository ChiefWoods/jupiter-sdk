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

export interface SharedAccountsExactOutRouteInstructionAccounts {
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

export interface SharedAccountsExactOutRouteInstructionArgs {
    id: number;
    routePlan: Array<RoutePlanStepArgs>;
    outAmount: number | bigint;
    quotedInAmount: number | bigint;
    slippageBps: number;
    platformFeeBps: number;
}

function getSharedAccountsExactOutRouteInstructionDataEncoder(): Encoder<SharedAccountsExactOutRouteInstructionArgs> {
    return getStructEncoder([
        ['id', getU8Encoder()],
        ['routePlan', getArrayEncoder(getRoutePlanStepEncoder())],
        ['outAmount', getU64Encoder()],
        ['quotedInAmount', getU64Encoder()],
        ['slippageBps', getU16Encoder()],
        ['platformFeeBps', getU8Encoder()],
    ]);
}

export function createSharedAccountsExactOutRouteInstruction(
    accounts: SharedAccountsExactOutRouteInstructionAccounts,
    args: SharedAccountsExactOutRouteInstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
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
    const instructionData = Buffer.from(getSharedAccountsExactOutRouteInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b0d169a89a7d453e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
