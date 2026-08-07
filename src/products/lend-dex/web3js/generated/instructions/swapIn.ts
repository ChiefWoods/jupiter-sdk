import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SWAP_IN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([141, 172, 10, 208, 69, 9, 56, 154]);

export interface SwapInInstructionAccounts {
    signer: Address;
    dex: Address;
    userToken0Account: Address;
    userToken1Account: Address;
    recipient?: Address;
    recipientToken0Account?: Address;
    recipientToken1Account?: Address;
    token0: Address;
    token1: Address;
    token0Reserve: Address;
    token1Reserve: Address;
    token0RateModel: Address;
    token1RateModel: Address;
    token0Vault: Address;
    token1Vault: Address;
    dexSupplyPositionToken0?: Address;
    dexSupplyPositionToken1?: Address;
    dexBorrowPositionToken0?: Address;
    dexBorrowPositionToken1?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    token0Program: Address;
    token1Program: Address;
    oracleProgram: Address;
}

export interface SwapInInstructionArgs {
    swap0to1: boolean;
    amountIn: number | bigint;
    amountOutMin: number | bigint;
}

function getSwapInInstructionDataEncoder(): Encoder<SwapInInstructionArgs> {
    return getStructEncoder([
        ['swap0to1', getBooleanEncoder()],
        ['amountIn', getU64Encoder()],
        ['amountOutMin', getU64Encoder()],
    ]);
}

function getSwapInInstructionDataDecoder(): Decoder<SwapInInstructionArgs> {
    return getStructDecoder([
        ['swap0to1', getBooleanDecoder()],
        ['amountIn', getU64Decoder()],
        ['amountOutMin', getU64Decoder()],
    ]);
}

export interface ParsedSwapInInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        dex: AccountMeta;
        userToken0Account: AccountMeta;
        userToken1Account: AccountMeta;
        recipient: AccountMeta;
        recipientToken0Account: AccountMeta;
        recipientToken1Account: AccountMeta;
        token0: AccountMeta;
        token1: AccountMeta;
        token0Reserve: AccountMeta;
        token1Reserve: AccountMeta;
        token0RateModel: AccountMeta;
        token1RateModel: AccountMeta;
        token0Vault: AccountMeta;
        token1Vault: AccountMeta;
        dexSupplyPositionToken0: AccountMeta;
        dexSupplyPositionToken1: AccountMeta;
        dexBorrowPositionToken0: AccountMeta;
        dexBorrowPositionToken1: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        token0Program: AccountMeta;
        token1Program: AccountMeta;
        oracleProgram: AccountMeta;
    };
    data: SwapInInstructionArgs;
}

export function parseSwapInInstruction(instruction: TransactionInstruction): ParsedSwapInInstruction {
    if (instruction.keys.length < 24) {
        throw new Error('Expected 24 account metas for SwapIn instruction');
    }
    if (!SWAP_IN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SwapIn instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            dex: instruction.keys[1]!,
            userToken0Account: instruction.keys[2]!,
            userToken1Account: instruction.keys[3]!,
            recipient: instruction.keys[4]!,
            recipientToken0Account: instruction.keys[5]!,
            recipientToken1Account: instruction.keys[6]!,
            token0: instruction.keys[7]!,
            token1: instruction.keys[8]!,
            token0Reserve: instruction.keys[9]!,
            token1Reserve: instruction.keys[10]!,
            token0RateModel: instruction.keys[11]!,
            token1RateModel: instruction.keys[12]!,
            token0Vault: instruction.keys[13]!,
            token1Vault: instruction.keys[14]!,
            dexSupplyPositionToken0: instruction.keys[15]!,
            dexSupplyPositionToken1: instruction.keys[16]!,
            dexBorrowPositionToken0: instruction.keys[17]!,
            dexBorrowPositionToken1: instruction.keys[18]!,
            liquidity: instruction.keys[19]!,
            liquidityProgram: instruction.keys[20]!,
            token0Program: instruction.keys[21]!,
            token1Program: instruction.keys[22]!,
            oracleProgram: instruction.keys[23]!,
        },
        data: getSwapInInstructionDataDecoder().decode(instructionData),
    };
}

export function createSwapInInstruction(
    accounts: SwapInInstructionAccounts,
    args: SwapInInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.userToken0Account, isSigner: false, isWritable: true },
        { pubkey: accounts.userToken1Account, isSigner: false, isWritable: true },
        accounts.recipient
            ? { pubkey: accounts.recipient, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientToken0Account
            ? { pubkey: accounts.recipientToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientToken1Account
            ? { pubkey: accounts.recipientToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.token0, isSigner: false, isWritable: false },
        { pubkey: accounts.token1, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Reserve, isSigner: false, isWritable: true },
        { pubkey: accounts.token1Reserve, isSigner: false, isWritable: true },
        { pubkey: accounts.token0RateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.token1RateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Vault, isSigner: false, isWritable: true },
        { pubkey: accounts.token1Vault, isSigner: false, isWritable: true },
        accounts.dexSupplyPositionToken0
            ? { pubkey: accounts.dexSupplyPositionToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexSupplyPositionToken1
            ? { pubkey: accounts.dexSupplyPositionToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken0
            ? { pubkey: accounts.dexBorrowPositionToken0, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken1
            ? { pubkey: accounts.dexBorrowPositionToken1, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Program, isSigner: false, isWritable: false },
        { pubkey: accounts.token1Program, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getSwapInInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SWAP_IN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
