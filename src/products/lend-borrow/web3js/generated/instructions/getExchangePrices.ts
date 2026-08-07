import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';

export const GET_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR = new Uint8Array([237, 128, 83, 152, 52, 21, 231, 86]);

export interface GetExchangePricesInstructionAccounts {
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReserves: Address;
    borrowTokenReserves: Address;
}

export interface ParsedGetExchangePricesInstruction {
    programId: Address;
    accounts: {
        vaultState: AccountMeta;
        vaultConfig: AccountMeta;
        supplyTokenReserves: AccountMeta;
        borrowTokenReserves: AccountMeta;
    };
    data: {};
}

export function parseGetExchangePricesInstruction(
    instruction: TransactionInstruction,
): ParsedGetExchangePricesInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for GetExchangePrices instruction');
    }
    if (!GET_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('GetExchangePrices instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            vaultState: instruction.keys[0]!,
            vaultConfig: instruction.keys[1]!,
            supplyTokenReserves: instruction.keys[2]!,
            borrowTokenReserves: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createGetExchangePricesInstruction(
    accounts: GetExchangePricesInstructionAccounts,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.vaultState, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReserves, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReserves, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(GET_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
