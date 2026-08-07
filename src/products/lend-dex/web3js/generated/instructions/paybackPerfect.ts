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

export const PAYBACK_PERFECT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([39, 2, 197, 102, 11, 186, 97, 1]);

export interface PaybackPerfectInstructionAccounts {
    signer: Address;
    dex: Address;
    user: Address;
    position: Address;
    userToken0Account: Address;
    userToken1Account: Address;
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
    oracleProgram: Address;
    token0Program: Address;
    token1Program: Address;
    recipient?: Address;
    recipientToken0Account?: Address;
    recipientToken1Account?: Address;
}

export interface PaybackPerfectInstructionArgs {
    shares: number | bigint;
    maxToken0: number | bigint;
    maxToken1: number | bigint;
}

function getPaybackPerfectInstructionDataEncoder(): Encoder<PaybackPerfectInstructionArgs> {
    return getStructEncoder([
        ['shares', getU64Encoder()],
        ['maxToken0', getU64Encoder()],
        ['maxToken1', getU64Encoder()],
    ]);
}

function getPaybackPerfectInstructionDataDecoder(): Decoder<PaybackPerfectInstructionArgs> {
    return getStructDecoder([
        ['shares', getU64Decoder()],
        ['maxToken0', getU64Decoder()],
        ['maxToken1', getU64Decoder()],
    ]);
}

export interface ParsedPaybackPerfectInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        dex: AccountMeta;
        user: AccountMeta;
        position: AccountMeta;
        userToken0Account: AccountMeta;
        userToken1Account: AccountMeta;
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
        oracleProgram: AccountMeta;
        token0Program: AccountMeta;
        token1Program: AccountMeta;
        recipient: AccountMeta;
        recipientToken0Account: AccountMeta;
        recipientToken1Account: AccountMeta;
    };
    data: PaybackPerfectInstructionArgs;
}

export function parsePaybackPerfectInstruction(instruction: TransactionInstruction): ParsedPaybackPerfectInstruction {
    if (instruction.keys.length < 26) {
        throw new Error('Expected 26 account metas for PaybackPerfect instruction');
    }
    if (!PAYBACK_PERFECT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('PaybackPerfect instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            dex: instruction.keys[1]!,
            user: instruction.keys[2]!,
            position: instruction.keys[3]!,
            userToken0Account: instruction.keys[4]!,
            userToken1Account: instruction.keys[5]!,
            token0: instruction.keys[6]!,
            token1: instruction.keys[7]!,
            token0Reserve: instruction.keys[8]!,
            token1Reserve: instruction.keys[9]!,
            token0RateModel: instruction.keys[10]!,
            token1RateModel: instruction.keys[11]!,
            token0Vault: instruction.keys[12]!,
            token1Vault: instruction.keys[13]!,
            dexSupplyPositionToken0: instruction.keys[14]!,
            dexSupplyPositionToken1: instruction.keys[15]!,
            dexBorrowPositionToken0: instruction.keys[16]!,
            dexBorrowPositionToken1: instruction.keys[17]!,
            liquidity: instruction.keys[18]!,
            liquidityProgram: instruction.keys[19]!,
            oracleProgram: instruction.keys[20]!,
            token0Program: instruction.keys[21]!,
            token1Program: instruction.keys[22]!,
            recipient: instruction.keys[23]!,
            recipientToken0Account: instruction.keys[24]!,
            recipientToken1Account: instruction.keys[25]!,
        },
        data: getPaybackPerfectInstructionDataDecoder().decode(instructionData),
    };
}

export function createPaybackPerfectInstruction(
    accounts: PaybackPerfectInstructionAccounts,
    args: PaybackPerfectInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.user, isSigner: true, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.userToken0Account, isSigner: false, isWritable: true },
        { pubkey: accounts.userToken1Account, isSigner: false, isWritable: true },
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
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Program, isSigner: false, isWritable: false },
        { pubkey: accounts.token1Program, isSigner: false, isWritable: false },
        accounts.recipient
            ? { pubkey: accounts.recipient, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientToken0Account
            ? { pubkey: accounts.recipientToken0Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.recipientToken1Account
            ? { pubkey: accounts.recipientToken1Account, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getPaybackPerfectInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(PAYBACK_PERFECT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
