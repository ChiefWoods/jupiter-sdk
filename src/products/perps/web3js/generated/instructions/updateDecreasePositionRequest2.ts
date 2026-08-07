import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    144, 200, 249, 255, 108, 217, 249, 116,
]);

export interface UpdateDecreasePositionRequest2InstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
}

export interface UpdateDecreasePositionRequest2InstructionArgs {
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
}

function getUpdateDecreasePositionRequest2InstructionDataEncoder(): Encoder<UpdateDecreasePositionRequest2InstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
    ]);
}

function getUpdateDecreasePositionRequest2InstructionDataDecoder(): Decoder<UpdateDecreasePositionRequest2InstructionArgs> {
    return getStructDecoder([
        ['sizeUsdDelta', getU64Decoder()],
        ['triggerPrice', getU64Decoder()],
    ]);
}

export interface ParsedUpdateDecreasePositionRequest2Instruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        positionRequest: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
    };
    data: UpdateDecreasePositionRequest2InstructionArgs;
}

export function parseUpdateDecreasePositionRequest2Instruction(
    instruction: TransactionInstruction,
): ParsedUpdateDecreasePositionRequest2Instruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for UpdateDecreasePositionRequest2 instruction');
    }
    if (
        !UPDATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateDecreasePositionRequest2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            position: instruction.keys[3]!,
            positionRequest: instruction.keys[4]!,
            custody: instruction.keys[5]!,
            custodyDovesPriceAccount: instruction.keys[6]!,
            custodyPythnetPriceAccount: instruction.keys[7]!,
        },
        data: getUpdateDecreasePositionRequest2InstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateDecreasePositionRequest2Instruction(
    accounts: UpdateDecreasePositionRequest2InstructionAccounts,
    args: UpdateDecreasePositionRequest2InstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateDecreasePositionRequest2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
