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

export const PAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([226, 150, 72, 211, 159, 51, 226, 39]);

export interface PauseTokenInstructionAccounts {
    authority: Address;
    authList: Address;
    tokenReserve: Address;
}

export interface PauseTokenInstructionArgs {
    mint: Address;
}

function getPauseTokenInstructionDataEncoder(): Encoder<PauseTokenInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getPauseTokenInstructionDataDecoder(): Decoder<PauseTokenInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedPauseTokenInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        tokenReserve: AccountMeta;
    };
    data: PauseTokenInstructionArgs;
}

export function parsePauseTokenInstruction(instruction: TransactionInstruction): ParsedPauseTokenInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for PauseToken instruction');
    }
    if (!PAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PauseToken instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
            tokenReserve: instruction.keys[2]!,
        },
        data: getPauseTokenInstructionDataDecoder().decode(instructionData),
    };
}

export function createPauseTokenInstruction(
    accounts: PauseTokenInstructionAccounts,
    args: PauseTokenInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getPauseTokenInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
