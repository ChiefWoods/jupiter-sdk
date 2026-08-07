import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRootEscrowTokenPda } from '../pdas/rootEscrowToken';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import {
    getRemainingAccountsInfoDecoder,
    getRemainingAccountsInfoEncoder,
    type RemainingAccountsInfoArgs,
} from '../types/remainingAccountsInfo';

export const FUND_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([251, 106, 189, 200, 108, 15, 144, 95]);

export interface FundRootEscrowInstructionAccounts {
    rootEscrow: Address;
    tokenMint: Address;
    rootEscrowToken?: Address;
    payer: Address;
    payerToken: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface FundRootEscrowInstructionArgs {
    maxAmount: number | bigint;
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getFundRootEscrowInstructionDataEncoder(): Encoder<FundRootEscrowInstructionArgs> {
    return getStructEncoder([
        ['maxAmount', getU64Encoder()],
        ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
    ]);
}

function getFundRootEscrowInstructionDataDecoder(): Decoder<FundRootEscrowInstructionArgs> {
    return getStructDecoder([
        ['maxAmount', getU64Decoder()],
        ['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())],
    ]);
}

export interface ParsedFundRootEscrowInstruction {
    programId: Address;
    accounts: {
        rootEscrow: AccountMeta;
        tokenMint: AccountMeta;
        rootEscrowToken: AccountMeta;
        payer: AccountMeta;
        payerToken: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: FundRootEscrowInstructionArgs;
}

export function parseFundRootEscrowInstruction(instruction: TransactionInstruction): ParsedFundRootEscrowInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for FundRootEscrow instruction');
    }
    if (!FUND_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('FundRootEscrow instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            rootEscrow: instruction.keys[0]!,
            tokenMint: instruction.keys[1]!,
            rootEscrowToken: instruction.keys[2]!,
            payer: instruction.keys[3]!,
            payerToken: instruction.keys[4]!,
            tokenProgram: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
            associatedTokenProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getFundRootEscrowInstructionDataDecoder().decode(instructionData),
    };
}

export async function createFundRootEscrowInstruction(
    accounts: FundRootEscrowInstructionAccounts,
    args: FundRootEscrowInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let rootEscrowToken = accounts.rootEscrowToken;
    if (!rootEscrowToken) {
        const [derived] = await findRootEscrowTokenPda({
            rootEscrow: accounts.rootEscrow,
            tokenProgram: accounts.tokenProgram,
            tokenMint: accounts.tokenMint,
        });
        rootEscrowToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.rootEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: rootEscrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.payerToken, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getFundRootEscrowInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(FUND_ROOT_ESCROW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
