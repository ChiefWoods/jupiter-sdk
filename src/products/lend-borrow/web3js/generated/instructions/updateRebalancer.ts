import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([206, 187, 54, 228, 145, 8, 203, 111]);

export interface UpdateRebalancerInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateRebalancerInstructionArgs {
    vaultId: number;
    newRebalancer: Address;
}

function getUpdateRebalancerInstructionDataEncoder(): Encoder<UpdateRebalancerInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['newRebalancer', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateRebalancerInstructionDataDecoder(): Decoder<UpdateRebalancerInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['newRebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateRebalancerInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateRebalancerInstructionArgs;
}

export function parseUpdateRebalancerInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateRebalancerInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateRebalancer instruction');
    }
    if (!UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateRebalancer instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultState: instruction.keys[2]!,
            vaultConfig: instruction.keys[3]!,
            supplyTokenReservesLiquidity: instruction.keys[4]!,
            borrowTokenReservesLiquidity: instruction.keys[5]!,
        },
        data: getUpdateRebalancerInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateRebalancerInstruction(
    accounts: UpdateRebalancerInstructionAccounts,
    args: UpdateRebalancerInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
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
