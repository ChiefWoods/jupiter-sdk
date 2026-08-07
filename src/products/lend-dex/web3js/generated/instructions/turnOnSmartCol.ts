import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const TURN_ON_SMART_COL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([143, 236, 131, 173, 22, 90, 214, 202]);

export interface TurnOnSmartColInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    adminToken0Account: Address;
    adminToken1Account: Address;
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
}

export interface TurnOnSmartColInstructionArgs {
    token0Amt: number | bigint;
}

function getTurnOnSmartColInstructionDataEncoder(): Encoder<TurnOnSmartColInstructionArgs> {
    return getStructEncoder([['token0Amt', getU64Encoder()]]);
}

function getTurnOnSmartColInstructionDataDecoder(): Decoder<TurnOnSmartColInstructionArgs> {
    return getStructDecoder([['token0Amt', getU64Decoder()]]);
}

export interface ParsedTurnOnSmartColInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        adminToken0Account: AccountMeta;
        adminToken1Account: AccountMeta;
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
    };
    data: TurnOnSmartColInstructionArgs;
}

export function parseTurnOnSmartColInstruction(instruction: TransactionInstruction): ParsedTurnOnSmartColInstruction {
    if (instruction.keys.length < 21) {
        throw new Error('Expected 21 account metas for TurnOnSmartCol instruction');
    }
    if (!TURN_ON_SMART_COL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('TurnOnSmartCol instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
            adminToken0Account: instruction.keys[3]!,
            adminToken1Account: instruction.keys[4]!,
            token0: instruction.keys[5]!,
            token1: instruction.keys[6]!,
            token0Reserve: instruction.keys[7]!,
            token1Reserve: instruction.keys[8]!,
            token0RateModel: instruction.keys[9]!,
            token1RateModel: instruction.keys[10]!,
            token0Vault: instruction.keys[11]!,
            token1Vault: instruction.keys[12]!,
            dexSupplyPositionToken0: instruction.keys[13]!,
            dexSupplyPositionToken1: instruction.keys[14]!,
            dexBorrowPositionToken0: instruction.keys[15]!,
            dexBorrowPositionToken1: instruction.keys[16]!,
            liquidity: instruction.keys[17]!,
            liquidityProgram: instruction.keys[18]!,
            token0Program: instruction.keys[19]!,
            token1Program: instruction.keys[20]!,
        },
        data: getTurnOnSmartColInstructionDataDecoder().decode(instructionData),
    };
}

export function createTurnOnSmartColInstruction(
    accounts: TurnOnSmartColInstructionAccounts,
    args: TurnOnSmartColInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.adminToken0Account, isSigner: false, isWritable: true },
        { pubkey: accounts.adminToken1Account, isSigner: false, isWritable: true },
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
    ];
    let data = Buffer.from(getTurnOnSmartColInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(TURN_ON_SMART_COL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
