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

export const SET_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([174, 231, 116, 203, 8, 58, 143, 203]);

export interface SetRewardsRateModelInstructionAccounts {
    signer: Address;
    lendingAdmin: Address;
    lending: Address;
    fTokenMint: Address;
    newRewardsRateModel: Address;
    supplyTokenReservesLiquidity: Address;
}

export interface SetRewardsRateModelInstructionArgs {
    mint: Address;
}

function getSetRewardsRateModelInstructionDataEncoder(): Encoder<SetRewardsRateModelInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getSetRewardsRateModelInstructionDataDecoder(): Decoder<SetRewardsRateModelInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedSetRewardsRateModelInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        lendingAdmin: AccountMeta;
        lending: AccountMeta;
        fTokenMint: AccountMeta;
        newRewardsRateModel: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
    };
    data: SetRewardsRateModelInstructionArgs;
}

export function parseSetRewardsRateModelInstruction(
    instruction: TransactionInstruction,
): ParsedSetRewardsRateModelInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for SetRewardsRateModel instruction');
    }
    if (
        !SET_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('SetRewardsRateModel instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            lendingAdmin: instruction.keys[1]!,
            lending: instruction.keys[2]!,
            fTokenMint: instruction.keys[3]!,
            newRewardsRateModel: instruction.keys[4]!,
            supplyTokenReservesLiquidity: instruction.keys[5]!,
        },
        data: getSetRewardsRateModelInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetRewardsRateModelInstruction(
    accounts: SetRewardsRateModelInstructionAccounts,
    args: SetRewardsRateModelInstructionArgs,
    programId: Address = LENDEARN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.newRewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getSetRewardsRateModelInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
