import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';
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

export const UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([206, 187, 54, 228, 145, 8, 203, 111]);

export interface UpdateRebalancerInstructionAccounts {
    signer: Address;
    lendingAdmin: Address;
}

export interface UpdateRebalancerInstructionArgs {
    newRebalancer: Address;
}

function getUpdateRebalancerInstructionDataEncoder(): Encoder<UpdateRebalancerInstructionArgs> {
    return getStructEncoder([
        ['newRebalancer', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateRebalancerInstructionDataDecoder(): Decoder<UpdateRebalancerInstructionArgs> {
    return getStructDecoder([
        ['newRebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateRebalancerInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        lendingAdmin: AccountMeta;
    };
    data: UpdateRebalancerInstructionArgs;
}

export function parseUpdateRebalancerInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateRebalancerInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateRebalancer instruction');
    }
    if (!UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateRebalancer instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            lendingAdmin: instruction.keys[1]!,
        },
        data: getUpdateRebalancerInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateRebalancerInstruction(
    accounts: UpdateRebalancerInstructionAccounts,
    args: UpdateRebalancerInstructionArgs,
    programId: Address = LENDEARN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateRebalancerInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
