import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const WITHDRAW_WITH_MAX_SHARES_BURN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    47, 197, 183, 171, 239, 18, 245, 171,
]);

export interface WithdrawWithMaxSharesBurnInstructionAccounts {
    signer: Address;
    ownerTokenAccount: Address;
    recipientTokenAccount: Address;
    lendingAdmin: Address;
    lending: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingSupplyPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    claimAccount?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    rewardsRateModel: Address;
    tokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
}

export interface WithdrawWithMaxSharesBurnInstructionArgs {
    amount: number | bigint;
    maxSharesBurn: number | bigint;
}

function getWithdrawWithMaxSharesBurnInstructionDataEncoder(): Encoder<WithdrawWithMaxSharesBurnInstructionArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['maxSharesBurn', getU64Encoder()],
    ]);
}

function getWithdrawWithMaxSharesBurnInstructionDataDecoder(): Decoder<WithdrawWithMaxSharesBurnInstructionArgs> {
    return getStructDecoder([
        ['amount', getU64Decoder()],
        ['maxSharesBurn', getU64Decoder()],
    ]);
}

export interface ParsedWithdrawWithMaxSharesBurnInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        ownerTokenAccount: AccountMeta;
        recipientTokenAccount: AccountMeta;
        lendingAdmin: AccountMeta;
        lending: AccountMeta;
        mint: AccountMeta;
        fTokenMint: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        lendingSupplyPositionOnLiquidity: AccountMeta;
        rateModel: AccountMeta;
        vault: AccountMeta;
        claimAccount: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        rewardsRateModel: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: WithdrawWithMaxSharesBurnInstructionArgs;
}

export function parseWithdrawWithMaxSharesBurnInstruction(
    instruction: TransactionInstruction,
): ParsedWithdrawWithMaxSharesBurnInstruction {
    if (instruction.keys.length < 18) {
        throw new Error('Expected 18 account metas for WithdrawWithMaxSharesBurn instruction');
    }
    if (
        !WITHDRAW_WITH_MAX_SHARES_BURN_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('WithdrawWithMaxSharesBurn instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            ownerTokenAccount: instruction.keys[1]!,
            recipientTokenAccount: instruction.keys[2]!,
            lendingAdmin: instruction.keys[3]!,
            lending: instruction.keys[4]!,
            mint: instruction.keys[5]!,
            fTokenMint: instruction.keys[6]!,
            supplyTokenReservesLiquidity: instruction.keys[7]!,
            lendingSupplyPositionOnLiquidity: instruction.keys[8]!,
            rateModel: instruction.keys[9]!,
            vault: instruction.keys[10]!,
            claimAccount: instruction.keys[11]!,
            liquidity: instruction.keys[12]!,
            liquidityProgram: instruction.keys[13]!,
            rewardsRateModel: instruction.keys[14]!,
            tokenProgram: instruction.keys[15]!,
            associatedTokenProgram: instruction.keys[16]!,
            systemProgram: instruction.keys[17]!,
        },
        data: getWithdrawWithMaxSharesBurnInstructionDataDecoder().decode(instructionData),
    };
}

export function createWithdrawWithMaxSharesBurnInstruction(
    accounts: WithdrawWithMaxSharesBurnInstructionAccounts,
    args: WithdrawWithMaxSharesBurnInstructionArgs,
    programId: Address = LENDEARN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.recipientTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        accounts.claimAccount
            ? { pubkey: accounts.claimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getWithdrawWithMaxSharesBurnInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(WITHDRAW_WITH_MAX_SHARES_BURN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
