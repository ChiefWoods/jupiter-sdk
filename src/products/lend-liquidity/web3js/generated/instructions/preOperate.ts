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

export const PRE_OPERATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([129, 205, 158, 155, 198, 155, 72, 133]);

export interface PreOperateInstructionAccounts {
    protocol: Address;
    liquidity: Address;
    userSupplyPosition?: Address;
    userBorrowPosition?: Address;
    vault: Address;
    tokenReserve: Address;
    tokenProgram: Address;
}

export interface PreOperateInstructionArgs {
    mint: Address;
}

function getPreOperateInstructionDataEncoder(): Encoder<PreOperateInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getPreOperateInstructionDataDecoder(): Decoder<PreOperateInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedPreOperateInstruction {
    programId: Address;
    accounts: {
        protocol: AccountMeta;
        liquidity: AccountMeta;
        userSupplyPosition: AccountMeta;
        userBorrowPosition: AccountMeta;
        vault: AccountMeta;
        tokenReserve: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: PreOperateInstructionArgs;
}

export function parsePreOperateInstruction(instruction: TransactionInstruction): ParsedPreOperateInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for PreOperate instruction');
    }
    if (!PRE_OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PreOperate instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            protocol: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            userSupplyPosition: instruction.keys[2]!,
            userBorrowPosition: instruction.keys[3]!,
            vault: instruction.keys[4]!,
            tokenReserve: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
        },
        data: getPreOperateInstructionDataDecoder().decode(instructionData),
    };
}

export function createPreOperateInstruction(
    accounts: PreOperateInstructionAccounts,
    args: PreOperateInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.protocol, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        accounts.userSupplyPosition
            ? { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.userBorrowPosition
            ? { pubkey: accounts.userBorrowPosition, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getPreOperateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PRE_OPERATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
