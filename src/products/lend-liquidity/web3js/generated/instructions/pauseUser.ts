import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export const PAUSE_USER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([18, 63, 43, 94, 239, 53, 101, 14]);

export interface PauseUserInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
    userBorrowPosition: Address;
}

export interface PauseUserInstructionArgs {
    protocol: Address;
    supplyMint: Address;
    borrowMint: Address;
    supplyStatus: OptionOrNullable<number>;
    borrowStatus: OptionOrNullable<number>;
}

function getPauseUserInstructionDataEncoder(): Encoder<PauseUserInstructionArgs> {
    return getStructEncoder([
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrowMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyStatus', getOptionEncoder(getU8Encoder())],
        ['borrowStatus', getOptionEncoder(getU8Encoder())],
    ]);
}

function getPauseUserInstructionDataDecoder(): Decoder<PauseUserInstructionArgs> {
    return getStructDecoder([
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrowMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyStatus', getOptionDecoder(getU8Decoder())],
        ['borrowStatus', getOptionDecoder(getU8Decoder())],
    ]);
}

export interface ParsedPauseUserInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        userSupplyPosition: AccountMeta;
        userBorrowPosition: AccountMeta;
    };
    data: PauseUserInstructionArgs;
}

export function parsePauseUserInstruction(instruction: TransactionInstruction): ParsedPauseUserInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for PauseUser instruction');
    }
    if (!PAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PauseUser instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
            userSupplyPosition: instruction.keys[2]!,
            userBorrowPosition: instruction.keys[3]!,
        },
        data: getPauseUserInstructionDataDecoder().decode(instructionData),
    };
}

export function createPauseUserInstruction(
    accounts: PauseUserInstructionAccounts,
    args: PauseUserInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getPauseUserInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PAUSE_USER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
