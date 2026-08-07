import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getFeesDecoder, getFeesEncoder, type FeesArgs } from '../types/fees';
import { getLimitDecoder, getLimitEncoder, type LimitArgs } from '../types/limit';

export const OPERATOR_SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([76, 201, 80, 18, 199, 92, 246, 105]);

export interface OperatorSetPoolConfigInstructionAccounts {
    operator: Address;
    pool: Address;
}

export interface OperatorSetPoolConfigInstructionArgs {
    fees: FeesArgs;
    limit: LimitArgs;
    maxRequestExecutionSec: number | bigint;
    maxTriggerPriceDiffBps: number | bigint;
    disableClosePositionRequest: boolean;
    maxLpTokenPriceChangeBps: number | bigint;
}

function getOperatorSetPoolConfigInstructionDataEncoder(): Encoder<OperatorSetPoolConfigInstructionArgs> {
    return getStructEncoder([
        ['fees', getFeesEncoder()],
        ['limit', getLimitEncoder()],
        ['maxRequestExecutionSec', getI64Encoder()],
        ['maxTriggerPriceDiffBps', getU64Encoder()],
        ['disableClosePositionRequest', getBooleanEncoder()],
        ['maxLpTokenPriceChangeBps', getU64Encoder()],
    ]);
}

function getOperatorSetPoolConfigInstructionDataDecoder(): Decoder<OperatorSetPoolConfigInstructionArgs> {
    return getStructDecoder([
        ['fees', getFeesDecoder()],
        ['limit', getLimitDecoder()],
        ['maxRequestExecutionSec', getI64Decoder()],
        ['maxTriggerPriceDiffBps', getU64Decoder()],
        ['disableClosePositionRequest', getBooleanDecoder()],
        ['maxLpTokenPriceChangeBps', getU64Decoder()],
    ]);
}

export interface ParsedOperatorSetPoolConfigInstruction {
    programId: Address;
    accounts: {
        operator: AccountMeta;
        pool: AccountMeta;
    };
    data: OperatorSetPoolConfigInstructionArgs;
}

export function parseOperatorSetPoolConfigInstruction(
    instruction: TransactionInstruction,
): ParsedOperatorSetPoolConfigInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for OperatorSetPoolConfig instruction');
    }
    if (
        !OPERATOR_SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('OperatorSetPoolConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operator: instruction.keys[0]!,
            pool: instruction.keys[1]!,
        },
        data: getOperatorSetPoolConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createOperatorSetPoolConfigInstruction(
    accounts: OperatorSetPoolConfigInstructionAccounts,
    args: OperatorSetPoolConfigInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operator, isSigner: true, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getOperatorSetPoolConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(OPERATOR_SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
