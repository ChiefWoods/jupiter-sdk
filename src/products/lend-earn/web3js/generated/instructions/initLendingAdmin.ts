import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';
import { findLendingAdminPda } from '../pdas/lendingAdmin';
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

export const INIT_LENDING_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([203, 185, 241, 165, 56, 254, 33, 9]);

export interface InitLendingAdminInstructionAccounts {
    authority: Address;
    lendingAdmin?: Address;
    systemProgram: Address;
}

export interface InitLendingAdminInstructionArgs {
    liquidityProgram: Address;
    rebalancer: Address;
    authority: Address;
}

function getInitLendingAdminInstructionDataEncoder(): Encoder<InitLendingAdminInstructionArgs> {
    return getStructEncoder([
        [
            'liquidityProgram',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
        ['rebalancer', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitLendingAdminInstructionDataDecoder(): Decoder<InitLendingAdminInstructionArgs> {
    return getStructDecoder([
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['rebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitLendingAdminInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        lendingAdmin: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitLendingAdminInstructionArgs;
}

export function parseInitLendingAdminInstruction(
    instruction: TransactionInstruction,
): ParsedInitLendingAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitLendingAdmin instruction');
    }
    if (!INIT_LENDING_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitLendingAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            lendingAdmin: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitLendingAdminInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitLendingAdminInstruction(
    accounts: InitLendingAdminInstructionAccounts,
    args: InitLendingAdminInstructionArgs,
    programId: Address = LENDEARN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lendingAdmin = accounts.lendingAdmin;
    if (!lendingAdmin) {
        const [derived] = await findLendingAdminPda(programId);
        lendingAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: lendingAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitLendingAdminInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_LENDING_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
