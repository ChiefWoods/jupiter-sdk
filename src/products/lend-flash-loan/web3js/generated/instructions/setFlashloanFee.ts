import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SET_FLASHLOAN_FEE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([120, 248, 221, 70, 84, 216, 0, 149]);

export interface SetFlashloanFeeInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export interface SetFlashloanFeeInstructionArgs {
    flashloanFee: number;
}

function getSetFlashloanFeeInstructionDataEncoder(): Encoder<SetFlashloanFeeInstructionArgs> {
    return getStructEncoder([['flashloanFee', getU16Encoder()]]);
}

function getSetFlashloanFeeInstructionDataDecoder(): Decoder<SetFlashloanFeeInstructionArgs> {
    return getStructDecoder([['flashloanFee', getU16Decoder()]]);
}

export interface ParsedSetFlashloanFeeInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        flashloanAdmin: AccountMeta;
    };
    data: SetFlashloanFeeInstructionArgs;
}

export function parseSetFlashloanFeeInstruction(instruction: TransactionInstruction): ParsedSetFlashloanFeeInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetFlashloanFee instruction');
    }
    if (!SET_FLASHLOAN_FEE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetFlashloanFee instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            flashloanAdmin: instruction.keys[1]!,
        },
        data: getSetFlashloanFeeInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetFlashloanFeeInstruction(
    accounts: SetFlashloanFeeInstructionAccounts,
    args: SetFlashloanFeeInstructionArgs,
    programId: Address = LENDFLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSetFlashloanFeeInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_FLASHLOAN_FEE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
