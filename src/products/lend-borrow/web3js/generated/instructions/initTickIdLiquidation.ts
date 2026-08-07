import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getI32Decoder,
    getI32Encoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_TICK_ID_LIQUIDATION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    56, 110, 121, 169, 152, 241, 86, 183,
]);

export interface InitTickIdLiquidationInstructionAccounts {
    signer: Address;
    tickData: Address;
    tickIdLiquidation: Address;
    systemProgram: Address;
}

export interface InitTickIdLiquidationInstructionArgs {
    vaultId: number;
    tick: number;
    totalIds: number;
}

function getInitTickIdLiquidationInstructionDataEncoder(): Encoder<InitTickIdLiquidationInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['tick', getI32Encoder()],
        ['totalIds', getU32Encoder()],
    ]);
}

function getInitTickIdLiquidationInstructionDataDecoder(): Decoder<InitTickIdLiquidationInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['tick', getI32Decoder()],
        ['totalIds', getU32Decoder()],
    ]);
}

export interface ParsedInitTickIdLiquidationInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        tickData: AccountMeta;
        tickIdLiquidation: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitTickIdLiquidationInstructionArgs;
}

export function parseInitTickIdLiquidationInstruction(
    instruction: TransactionInstruction,
): ParsedInitTickIdLiquidationInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitTickIdLiquidation instruction');
    }
    if (
        !INIT_TICK_ID_LIQUIDATION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('InitTickIdLiquidation instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            tickData: instruction.keys[1]!,
            tickIdLiquidation: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitTickIdLiquidationInstructionDataDecoder().decode(instructionData),
    };
}

export function createInitTickIdLiquidationInstruction(
    accounts: InitTickIdLiquidationInstructionAccounts,
    args: InitTickIdLiquidationInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.tickData, isSigner: false, isWritable: false },
        { pubkey: accounts.tickIdLiquidation, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitTickIdLiquidationInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_TICK_ID_LIQUIDATION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
