import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getFeesDecoder, getFeesEncoder, type FeesArgs } from '../types/fees';
import { getLimitDecoder, getLimitEncoder, type LimitArgs } from '../types/limit';

export const ADD_POOL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([115, 230, 212, 211, 175, 49, 39, 169]);

export interface AddPoolInstructionAccounts {
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    lpTokenMint: Address;
    systemProgram: Address;
    tokenProgram: Address;
    rent: Address;
}

export interface AddPoolInstructionArgs {
    name: string;
    limit: LimitArgs;
    fees: FeesArgs;
    maxRequestExecutionSec: number | bigint;
}

function getAddPoolInstructionDataEncoder(): Encoder<AddPoolInstructionArgs> {
    return getStructEncoder([
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['limit', getLimitEncoder()],
        ['fees', getFeesEncoder()],
        ['maxRequestExecutionSec', getI64Encoder()],
    ]);
}

function getAddPoolInstructionDataDecoder(): Decoder<AddPoolInstructionArgs> {
    return getStructDecoder([
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['limit', getLimitDecoder()],
        ['fees', getFeesDecoder()],
        ['maxRequestExecutionSec', getI64Decoder()],
    ]);
}

export interface ParsedAddPoolInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        lpTokenMint: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: AddPoolInstructionArgs;
}

export function parseAddPoolInstruction(instruction: TransactionInstruction): ParsedAddPoolInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for AddPool instruction');
    }
    if (!ADD_POOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('AddPool instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            transferAuthority: instruction.keys[1]!,
            perpetuals: instruction.keys[2]!,
            pool: instruction.keys[3]!,
            lpTokenMint: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            rent: instruction.keys[7]!,
        },
        data: getAddPoolInstructionDataDecoder().decode(instructionData),
    };
}

export function createAddPoolInstruction(
    accounts: AddPoolInstructionAccounts,
    args: AddPoolInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getAddPoolInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ADD_POOL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
