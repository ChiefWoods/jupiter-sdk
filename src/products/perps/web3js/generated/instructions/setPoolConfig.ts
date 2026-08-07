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
import {
    getSecp256k1PubkeyDecoder,
    getSecp256k1PubkeyEncoder,
    type Secp256k1PubkeyArgs,
} from '../types/secp256k1Pubkey';

export const SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([216, 87, 65, 125, 113, 110, 185, 120]);

export interface SetPoolConfigInstructionAccounts {
    admin: Address;
    perpetuals: Address;
    pool: Address;
}

export interface SetPoolConfigInstructionArgs {
    fees: FeesArgs;
    limit: LimitArgs;
    maxRequestExecutionSec: number | bigint;
    parameterUpdateOracle: Secp256k1PubkeyArgs;
    maxTriggerPriceDiffBps: number | bigint;
    disableClosePositionRequest: boolean;
    maxLpTokenPriceChangeBps: number | bigint;
}

function getSetPoolConfigInstructionDataEncoder(): Encoder<SetPoolConfigInstructionArgs> {
    return getStructEncoder([
        ['fees', getFeesEncoder()],
        ['limit', getLimitEncoder()],
        ['maxRequestExecutionSec', getI64Encoder()],
        ['parameterUpdateOracle', getSecp256k1PubkeyEncoder()],
        ['maxTriggerPriceDiffBps', getU64Encoder()],
        ['disableClosePositionRequest', getBooleanEncoder()],
        ['maxLpTokenPriceChangeBps', getU64Encoder()],
    ]);
}

function getSetPoolConfigInstructionDataDecoder(): Decoder<SetPoolConfigInstructionArgs> {
    return getStructDecoder([
        ['fees', getFeesDecoder()],
        ['limit', getLimitDecoder()],
        ['maxRequestExecutionSec', getI64Decoder()],
        ['parameterUpdateOracle', getSecp256k1PubkeyDecoder()],
        ['maxTriggerPriceDiffBps', getU64Decoder()],
        ['disableClosePositionRequest', getBooleanDecoder()],
        ['maxLpTokenPriceChangeBps', getU64Decoder()],
    ]);
}

export interface ParsedSetPoolConfigInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
    };
    data: SetPoolConfigInstructionArgs;
}

export function parseSetPoolConfigInstruction(instruction: TransactionInstruction): ParsedSetPoolConfigInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for SetPoolConfig instruction');
    }
    if (!SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetPoolConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
        },
        data: getSetPoolConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetPoolConfigInstruction(
    accounts: SetPoolConfigInstructionAccounts,
    args: SetPoolConfigInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSetPoolConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
