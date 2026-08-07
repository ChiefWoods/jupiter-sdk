import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INSTANT_UPDATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    136, 245, 229, 58, 121, 141, 12, 207,
]);

export interface InstantUpdateLimitOrderInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
}

export interface InstantUpdateLimitOrderInstructionArgs {
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
    requestTime: number | bigint;
}

function getInstantUpdateLimitOrderInstructionDataEncoder(): Encoder<InstantUpdateLimitOrderInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

function getInstantUpdateLimitOrderInstructionDataDecoder(): Decoder<InstantUpdateLimitOrderInstructionArgs> {
    return getStructDecoder([
        ['sizeUsdDelta', getU64Decoder()],
        ['triggerPrice', getU64Decoder()],
        ['requestTime', getI64Decoder()],
    ]);
}

export interface ParsedInstantUpdateLimitOrderInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        apiKeeper: AccountMeta;
        owner: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        positionRequest: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
    };
    data: InstantUpdateLimitOrderInstructionArgs;
}

export function parseInstantUpdateLimitOrderInstruction(
    instruction: TransactionInstruction,
): ParsedInstantUpdateLimitOrderInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for InstantUpdateLimitOrder instruction');
    }
    if (
        !INSTANT_UPDATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InstantUpdateLimitOrder instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            apiKeeper: instruction.keys[1]!,
            owner: instruction.keys[2]!,
            perpetuals: instruction.keys[3]!,
            pool: instruction.keys[4]!,
            position: instruction.keys[5]!,
            positionRequest: instruction.keys[6]!,
            custody: instruction.keys[7]!,
            custodyDovesPriceAccount: instruction.keys[8]!,
            custodyPythnetPriceAccount: instruction.keys[9]!,
        },
        data: getInstantUpdateLimitOrderInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantUpdateLimitOrderInstruction(
    accounts: InstantUpdateLimitOrderInstructionAccounts,
    args: InstantUpdateLimitOrderInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInstantUpdateLimitOrderInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_UPDATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
