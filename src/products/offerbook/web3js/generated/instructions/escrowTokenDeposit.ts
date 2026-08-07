import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findUserEscrowTokenAccountPda } from '../pdas/userEscrowTokenAccount';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const ESCROW_TOKEN_DEPOSIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([170, 3, 249, 121, 68, 108, 240, 239]);

export interface EscrowTokenDepositInstructionAccounts {
    signer: Address;
    signerTokenAccount: Address;
    signerUser: Address;
    userEscrowTokenAccount?: Address;
    mint: Address;
    associatedTokenProgram: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface EscrowTokenDepositInstructionArgs {
    amount: number | bigint;
}

function getEscrowTokenDepositInstructionDataEncoder(): Encoder<EscrowTokenDepositInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getEscrowTokenDepositInstructionDataDecoder(): Decoder<EscrowTokenDepositInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedEscrowTokenDepositInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerTokenAccount: AccountMeta;
        signerUser: AccountMeta;
        userEscrowTokenAccount: AccountMeta;
        mint: AccountMeta;
        associatedTokenProgram: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: EscrowTokenDepositInstructionArgs;
}

export function parseEscrowTokenDepositInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowTokenDepositInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for EscrowTokenDeposit instruction');
    }
    if (!ESCROW_TOKEN_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('EscrowTokenDeposit instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerTokenAccount: instruction.keys[1]!,
            signerUser: instruction.keys[2]!,
            userEscrowTokenAccount: instruction.keys[3]!,
            mint: instruction.keys[4]!,
            associatedTokenProgram: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getEscrowTokenDepositInstructionDataDecoder().decode(instructionData),
    };
}

export async function createEscrowTokenDepositInstruction(
    accounts: EscrowTokenDepositInstructionAccounts,
    args: EscrowTokenDepositInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let userEscrowTokenAccount = accounts.userEscrowTokenAccount;
    if (!userEscrowTokenAccount) {
        const [derived] = await findUserEscrowTokenAccountPda({
            signerUser: accounts.signerUser,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
        userEscrowTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getEscrowTokenDepositInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ESCROW_TOKEN_DEPOSIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
