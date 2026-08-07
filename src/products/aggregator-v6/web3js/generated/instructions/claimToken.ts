import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { findDestinationTokenAccountPda } from '../pdas/destinationTokenAccount';
import {
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([116, 206, 27, 191, 166, 19, 0, 73]);

export interface ClaimTokenInstructionAccounts {
    payer: Address;
    wallet: Address;
    programAuthority: Address;
    programTokenAccount: Address;
    destinationTokenAccount?: Address;
    mint: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface ClaimTokenInstructionArgs {
    id: number;
}

function getClaimTokenInstructionDataEncoder(): Encoder<ClaimTokenInstructionArgs> {
    return getStructEncoder([['id', getU8Encoder()]]);
}

function getClaimTokenInstructionDataDecoder(): Decoder<ClaimTokenInstructionArgs> {
    return getStructDecoder([['id', getU8Decoder()]]);
}

export interface ParsedClaimTokenInstruction {
    programId: Address;
    accounts: {
        payer: AccountMeta;
        wallet: AccountMeta;
        programAuthority: AccountMeta;
        programTokenAccount: AccountMeta;
        destinationTokenAccount: AccountMeta;
        mint: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: ClaimTokenInstructionArgs;
}

export function parseClaimTokenInstruction(instruction: TransactionInstruction): ParsedClaimTokenInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for ClaimToken instruction');
    }
    if (!CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            payer: instruction.keys[0]!,
            wallet: instruction.keys[1]!,
            programAuthority: instruction.keys[2]!,
            programTokenAccount: instruction.keys[3]!,
            destinationTokenAccount: instruction.keys[4]!,
            mint: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            associatedTokenProgram: instruction.keys[7]!,
            systemProgram: instruction.keys[8]!,
        },
        data: getClaimTokenInstructionDataDecoder().decode(instructionData),
    };
}

export async function createClaimTokenInstruction(
    accounts: ClaimTokenInstructionAccounts,
    args: ClaimTokenInstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let destinationTokenAccount = accounts.destinationTokenAccount;
    if (!destinationTokenAccount) {
        const [derived] = await findDestinationTokenAccountPda({
            wallet: accounts.wallet,
            tokenProgram: accounts.tokenProgram,
            mint: accounts.mint,
        });
        destinationTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.wallet, isSigner: false, isWritable: false },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.programTokenAccount, isSigner: false, isWritable: true },
        { pubkey: destinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getClaimTokenInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
