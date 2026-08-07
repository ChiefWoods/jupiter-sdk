import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDORACLE_PROGRAM_ID } from '../programs/lendOracle';
import { findOracleAdminPda } from '../pdas/oracleAdmin';
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

export const INIT_ADMIN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([97, 65, 97, 27, 200, 206, 72, 219]);

export interface InitAdminInstructionAccounts {
    signer: Address;
    oracleAdmin?: Address;
    systemProgram: Address;
}

export interface InitAdminInstructionArgs {
    authority: Address;
}

function getInitAdminInstructionDataEncoder(): Encoder<InitAdminInstructionArgs> {
    return getStructEncoder([
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitAdminInstructionDataDecoder(): Decoder<InitAdminInstructionArgs> {
    return getStructDecoder([
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitAdminInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        oracleAdmin: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitAdminInstructionArgs;
}

export function parseInitAdminInstruction(instruction: TransactionInstruction): ParsedInitAdminInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitAdmin instruction');
    }
    if (!INIT_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitAdmin instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            oracleAdmin: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitAdminInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitAdminInstruction(
    accounts: InitAdminInstructionAccounts,
    args: InitAdminInstructionArgs,
    programId: Address = LENDORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let oracleAdmin = accounts.oracleAdmin;
    if (!oracleAdmin) {
        const [derived] = await findOracleAdminPda(programId);
        oracleAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: oracleAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitAdminInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_ADMIN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
