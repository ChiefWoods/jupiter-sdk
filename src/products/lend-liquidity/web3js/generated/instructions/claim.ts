import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CLAIM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([62, 198, 214, 193, 213, 159, 108, 210]);

export interface ClaimInstructionAccounts {
    user: Address;
    liquidity: Address;
    tokenReserve: Address;
    mint: Address;
    recipientTokenAccount: Address;
    vault: Address;
    claimAccount: Address;
    tokenProgram: Address;
}

export interface ClaimInstructionArgs {
    recipient: Address;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([
        ['recipient', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getClaimInstructionDataDecoder(): Decoder<ClaimInstructionArgs> {
    return getStructDecoder([
        ['recipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedClaimInstruction {
    programId: Address;
    accounts: {
        user: AccountMeta;
        liquidity: AccountMeta;
        tokenReserve: AccountMeta;
        mint: AccountMeta;
        recipientTokenAccount: AccountMeta;
        vault: AccountMeta;
        claimAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: ClaimInstructionArgs;
}

export function parseClaimInstruction(instruction: TransactionInstruction): ParsedClaimInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for Claim instruction');
    }
    if (!CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Claim instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            user: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            tokenReserve: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            recipientTokenAccount: instruction.keys[4]!,
            vault: instruction.keys[5]!,
            claimAccount: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
        },
        data: getClaimInstructionDataDecoder().decode(instructionData),
    };
}

export function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.recipientTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.claimAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
