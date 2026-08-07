import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { findAuthListPda } from '../pdas/authList';
import { findLiquidityPda } from '../pdas/liquidity';
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

export const INIT_LIQUIDITY_INSTRUCTION_DISCRIMINATOR = new Uint8Array([95, 189, 216, 183, 188, 62, 244, 108]);

export interface InitLiquidityInstructionAccounts {
    signer: Address;
    liquidity?: Address;
    authList?: Address;
    systemProgram: Address;
}

export interface InitLiquidityInstructionArgs {
    authority: Address;
    revenueCollector: Address;
}

function getInitLiquidityInstructionDataEncoder(): Encoder<InitLiquidityInstructionArgs> {
    return getStructEncoder([
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        [
            'revenueCollector',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
    ]);
}

function getInitLiquidityInstructionDataDecoder(): Decoder<InitLiquidityInstructionArgs> {
    return getStructDecoder([
        ['authority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['revenueCollector', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitLiquidityInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        liquidity: AccountMeta;
        authList: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitLiquidityInstructionArgs;
}

export function parseInitLiquidityInstruction(instruction: TransactionInstruction): ParsedInitLiquidityInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitLiquidity instruction');
    }
    if (!INIT_LIQUIDITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitLiquidity instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            liquidity: instruction.keys[1]!,
            authList: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitLiquidityInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitLiquidityInstruction(
    accounts: InitLiquidityInstructionAccounts,
    args: InitLiquidityInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let liquidity = accounts.liquidity;
    if (!liquidity) {
        const [derived] = await findLiquidityPda(programId);
        liquidity = derived;
    }
    let authList = accounts.authList;
    if (!authList) {
        const [derived] = await findAuthListPda(programId);
        authList = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: liquidity, isSigner: false, isWritable: true },
        { pubkey: authList, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitLiquidityInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_LIQUIDITY_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
