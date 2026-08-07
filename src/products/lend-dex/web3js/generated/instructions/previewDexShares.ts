import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const PREVIEW_DEX_SHARES_INSTRUCTION_DISCRIMINATOR = new Uint8Array([246, 97, 50, 171, 63, 142, 62, 229]);

export interface PreviewDexSharesInstructionAccounts {
    dex: Address;
    position: Address;
    token0Reserve: Address;
    token1Reserve: Address;
    dexSupplyPositionToken0?: Address;
    dexSupplyPositionToken1?: Address;
    dexBorrowPositionToken0?: Address;
    dexBorrowPositionToken1?: Address;
    oracleProgram: Address;
}

export interface PreviewDexSharesInstructionArgs {
    colToken0: number | bigint;
    colToken1: number | bigint;
    debtToken0: number | bigint;
    debtToken1: number | bigint;
}

function getPreviewDexSharesInstructionDataEncoder(): Encoder<PreviewDexSharesInstructionArgs> {
    return getStructEncoder([
        ['colToken0', getI64Encoder()],
        ['colToken1', getI64Encoder()],
        ['debtToken0', getI64Encoder()],
        ['debtToken1', getI64Encoder()],
    ]);
}

function getPreviewDexSharesInstructionDataDecoder(): Decoder<PreviewDexSharesInstructionArgs> {
    return getStructDecoder([
        ['colToken0', getI64Decoder()],
        ['colToken1', getI64Decoder()],
        ['debtToken0', getI64Decoder()],
        ['debtToken1', getI64Decoder()],
    ]);
}

export interface ParsedPreviewDexSharesInstruction {
    programId: Address;
    accounts: {
        dex: AccountMeta;
        position: AccountMeta;
        token0Reserve: AccountMeta;
        token1Reserve: AccountMeta;
        dexSupplyPositionToken0: AccountMeta;
        dexSupplyPositionToken1: AccountMeta;
        dexBorrowPositionToken0: AccountMeta;
        dexBorrowPositionToken1: AccountMeta;
        oracleProgram: AccountMeta;
    };
    data: PreviewDexSharesInstructionArgs;
}

export function parsePreviewDexSharesInstruction(
    instruction: TransactionInstruction,
): ParsedPreviewDexSharesInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for PreviewDexShares instruction');
    }
    if (!PREVIEW_DEX_SHARES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PreviewDexShares instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            dex: instruction.keys[0]!,
            position: instruction.keys[1]!,
            token0Reserve: instruction.keys[2]!,
            token1Reserve: instruction.keys[3]!,
            dexSupplyPositionToken0: instruction.keys[4]!,
            dexSupplyPositionToken1: instruction.keys[5]!,
            dexBorrowPositionToken0: instruction.keys[6]!,
            dexBorrowPositionToken1: instruction.keys[7]!,
            oracleProgram: instruction.keys[8]!,
        },
        data: getPreviewDexSharesInstructionDataDecoder().decode(instructionData),
    };
}

export function createPreviewDexSharesInstruction(
    accounts: PreviewDexSharesInstructionAccounts,
    args: PreviewDexSharesInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Reserve, isSigner: false, isWritable: false },
        { pubkey: accounts.token1Reserve, isSigner: false, isWritable: false },
        accounts.dexSupplyPositionToken0
            ? { pubkey: accounts.dexSupplyPositionToken0, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexSupplyPositionToken1
            ? { pubkey: accounts.dexSupplyPositionToken1, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken0
            ? { pubkey: accounts.dexBorrowPositionToken0, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken1
            ? { pubkey: accounts.dexBorrowPositionToken1, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getPreviewDexSharesInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PREVIEW_DEX_SHARES_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
