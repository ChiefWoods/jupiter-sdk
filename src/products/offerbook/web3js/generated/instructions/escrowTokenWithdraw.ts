import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const ESCROW_TOKEN_WITHDRAW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([183, 204, 14, 69, 17, 76, 223, 105]);

export interface EscrowTokenWithdrawInstructionAccounts {
    signer: Address;
    signerTokenAccount: Address;
    signerUser: Address;
    userEscrowTokenAccount: Address;
    mint: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface EscrowTokenWithdrawInstructionArgs {
    amount: number | bigint;
}

function getEscrowTokenWithdrawInstructionDataEncoder(): Encoder<EscrowTokenWithdrawInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getEscrowTokenWithdrawInstructionDataDecoder(): Decoder<EscrowTokenWithdrawInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedEscrowTokenWithdrawInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerTokenAccount: AccountMeta;
        signerUser: AccountMeta;
        userEscrowTokenAccount: AccountMeta;
        mint: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: EscrowTokenWithdrawInstructionArgs;
}

export function parseEscrowTokenWithdrawInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowTokenWithdrawInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for EscrowTokenWithdraw instruction');
    }
    if (!ESCROW_TOKEN_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('EscrowTokenWithdraw instruction discriminator mismatch');
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
            tokenProgram: instruction.keys[5]!,
            eventAuthority: instruction.keys[6]!,
            program: instruction.keys[7]!,
        },
        data: getEscrowTokenWithdrawInstructionDataDecoder().decode(instructionData),
    };
}

export async function createEscrowTokenWithdrawInstruction(
    accounts: EscrowTokenWithdrawInstructionAccounts,
    args: EscrowTokenWithdrawInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.signerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getEscrowTokenWithdrawInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ESCROW_TOKEN_WITHDRAW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
