import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import { findDexAdminPda } from '../pdas/dexAdmin';
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

export const INIT_DEX_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([16, 61, 98, 61, 189, 243, 52, 252]);

export interface InitDexAdminInstructionAccounts {
    signer: Address;
    dexAdmin?: Address;
    systemProgram: Address;
}

export interface InitDexAdminInstructionArgs {
    liquidity: Address;
    authority: Address;
}

function getInitDexAdminInstructionDataEncoder(): Encoder<InitDexAdminInstructionArgs> {
    return getStructEncoder([
        ['liquidity', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitDexAdminInstructionDataDecoder(): Decoder<InitDexAdminInstructionArgs> {
    return getStructDecoder([
        ['liquidity', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitDexAdminInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        dexAdmin: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitDexAdminInstructionArgs;
}

export function parseInitDexAdminInstruction(instruction: TransactionInstruction): ParsedInitDexAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitDexAdmin instruction');
    }
    if (!INIT_DEX_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitDexAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitDexAdminInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitDexAdminInstruction(
    accounts: InitDexAdminInstructionAccounts,
    args: InitDexAdminInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let dexAdmin = accounts.dexAdmin;
    if (!dexAdmin) {
        const [derived] = await findDexAdminPda(programId);
        dexAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: dexAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitDexAdminInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_DEX_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
