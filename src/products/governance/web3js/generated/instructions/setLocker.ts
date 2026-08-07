import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
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

export const SET_LOCKER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([17, 6, 101, 72, 250, 23, 152, 96]);

export interface SetLockerInstructionAccounts {
    governor: Address;
    smartWallet: Address;
}

export interface SetLockerInstructionArgs {
    newLocker: Address;
}

function getSetLockerInstructionDataEncoder(): Encoder<SetLockerInstructionArgs> {
    return getStructEncoder([
        ['newLocker', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getSetLockerInstructionDataDecoder(): Decoder<SetLockerInstructionArgs> {
    return getStructDecoder([
        ['newLocker', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedSetLockerInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        smartWallet: AccountMeta;
    };
    data: SetLockerInstructionArgs;
}

export function parseSetLockerInstruction(instruction: TransactionInstruction): ParsedSetLockerInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetLocker instruction');
    }
    if (!SET_LOCKER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetLocker instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            smartWallet: instruction.keys[1]!,
        },
        data: getSetLockerInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetLockerInstruction(
    accounts: SetLockerInstructionAccounts,
    args: SetLockerInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    let data = Buffer.from(getSetLockerInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_LOCKER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
