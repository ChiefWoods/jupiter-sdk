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

export const CLOSE_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([241, 146, 203, 216, 58, 222, 91, 118]);

export interface CloseClaimAccountInstructionAccounts {
    user: Address;
    claimAccount: Address;
    systemProgram: Address;
}

export interface CloseClaimAccountInstructionArgs {
    mint: Address;
}

function getCloseClaimAccountInstructionDataEncoder(): Encoder<CloseClaimAccountInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getCloseClaimAccountInstructionDataDecoder(): Decoder<CloseClaimAccountInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedCloseClaimAccountInstruction {
    programId: Address;
    accounts: {
        user: AccountMeta;
        claimAccount: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CloseClaimAccountInstructionArgs;
}

export function parseCloseClaimAccountInstruction(
    instruction: TransactionInstruction,
): ParsedCloseClaimAccountInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for CloseClaimAccount instruction');
    }
    if (!CLOSE_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseClaimAccount instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            user: instruction.keys[0]!,
            claimAccount: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getCloseClaimAccountInstructionDataDecoder().decode(instructionData),
    };
}

export function createCloseClaimAccountInstruction(
    accounts: CloseClaimAccountInstructionAccounts,
    args: CloseClaimAccountInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.claimAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCloseClaimAccountInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
