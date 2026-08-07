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

export const UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([71, 115, 128, 252, 182, 126, 234, 62]);

export interface UnpauseUserInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition: Address;
    userBorrowPosition: Address;
}

export interface UnpauseUserInstructionArgs {
    protocol: Address;
    supplyMint: Address;
    borrowMint: Address;
    supplyStatus: OptionOrNullable<number>;
    borrowStatus: OptionOrNullable<number>;
}

function getUnpauseUserInstructionDataEncoder(): Encoder<UnpauseUserInstructionArgs> {
    return getStructEncoder([
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrowMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['supplyStatus', getOptionEncoder(getU8Encoder())],
        ['borrowStatus', getOptionEncoder(getU8Encoder())],
    ]);
}

function getUnpauseUserInstructionDataDecoder(): Decoder<UnpauseUserInstructionArgs> {
    return getStructDecoder([
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrowMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['supplyStatus', getOptionDecoder(getU8Decoder())],
        ['borrowStatus', getOptionDecoder(getU8Decoder())],
    ]);
}

export interface ParsedUnpauseUserInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        userSupplyPosition: AccountMeta;
        userBorrowPosition: AccountMeta;
    };
    data: UnpauseUserInstructionArgs;
}

export function parseUnpauseUserInstruction(instruction: TransactionInstruction): ParsedUnpauseUserInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for UnpauseUser instruction');
    }
    if (!UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UnpauseUser instruction discriminator mismatch');
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
        data: getUnpauseUserInstructionDataDecoder().decode(instructionData),
    };
}

export function createUnpauseUserInstruction(
    accounts: UnpauseUserInstructionAccounts,
    args: UnpauseUserInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUnpauseUserInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
