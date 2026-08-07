import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const UPDATE_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR = new Uint8Array([209, 14, 188, 95, 242, 20, 119, 196]);

export interface UpdateExchangePricesInstructionAccounts {
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateExchangePricesInstructionArgs {
    vaultId: number;
}

function getUpdateExchangePricesInstructionDataEncoder(): Encoder<UpdateExchangePricesInstructionArgs> {
    return getStructEncoder([['vaultId', getU16Encoder()]]);
}

function getUpdateExchangePricesInstructionDataDecoder(): Decoder<UpdateExchangePricesInstructionArgs> {
    return getStructDecoder([['vaultId', getU16Decoder()]]);
}

export interface ParsedUpdateExchangePricesInstruction {
    programId: Address;
    accounts: {
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
    };
    data: UpdateExchangePricesInstructionArgs;
}

export function parseUpdateExchangePricesInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateExchangePricesInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for UpdateExchangePrices instruction');
    }
    if (
        !UPDATE_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('UpdateExchangePrices instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            vaultState: instruction.keys[0]!,
            vaultConfig: instruction.keys[1]!,
            supplyTokenReservesLiquidity: instruction.keys[2]!,
            borrowTokenReservesLiquidity: instruction.keys[3]!,
        },
        data: getUpdateExchangePricesInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateExchangePricesInstruction(
    accounts: UpdateExchangePricesInstructionAccounts,
    args: UpdateExchangePricesInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateExchangePricesInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
