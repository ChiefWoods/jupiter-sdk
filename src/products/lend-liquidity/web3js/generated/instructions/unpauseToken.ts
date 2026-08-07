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

export const UNPAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([108, 117, 62, 30, 200, 92, 255, 202]);

export interface UnpauseTokenInstructionAccounts {
    authority: Address;
    authList: Address;
    tokenReserve: Address;
}

export interface UnpauseTokenInstructionArgs {
    mint: Address;
}

function getUnpauseTokenInstructionDataEncoder(): Encoder<UnpauseTokenInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUnpauseTokenInstructionDataDecoder(): Decoder<UnpauseTokenInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUnpauseTokenInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        tokenReserve: AccountMeta;
    };
    data: UnpauseTokenInstructionArgs;
}

export function parseUnpauseTokenInstruction(instruction: TransactionInstruction): ParsedUnpauseTokenInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for UnpauseToken instruction');
    }
    if (!UNPAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UnpauseToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
            tokenReserve: instruction.keys[2]!,
        },
        data: getUnpauseTokenInstructionDataDecoder().decode(instructionData),
    };
}

export function createUnpauseTokenInstruction(
    accounts: UnpauseTokenInstructionAccounts,
    args: UnpauseTokenInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUnpauseTokenInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UNPAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
