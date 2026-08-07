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

export const MINT_WITH_MAX_ASSETS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([6, 94, 69, 122, 30, 179, 146, 171]);

export interface MintWithMaxAssetsInstructionAccounts {
    signer: Address;
    depositorTokenAccount: Address;
    recipientTokenAccount: Address;
    mint: Address;
    lendingAdmin: Address;
    lending: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingSupplyPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    liquidity: Address;
    liquidityProgram: Address;
    rewardsRateModel: Address;
    tokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
}

export interface MintWithMaxAssetsInstructionArgs {
    shares: number | bigint;
    maxAssets: number | bigint;
}

function getMintWithMaxAssetsInstructionDataEncoder(): Encoder<MintWithMaxAssetsInstructionArgs> {
    return getStructEncoder([
        ['shares', getU64Encoder()],
        ['maxAssets', getU64Encoder()],
    ]);
}

function getMintWithMaxAssetsInstructionDataDecoder(): Decoder<MintWithMaxAssetsInstructionArgs> {
    return getStructDecoder([
        ['shares', getU64Decoder()],
        ['maxAssets', getU64Decoder()],
    ]);
}

export interface ParsedMintWithMaxAssetsInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        depositorTokenAccount: AccountMeta;
        recipientTokenAccount: AccountMeta;
        mint: AccountMeta;
        lendingAdmin: AccountMeta;
        lending: AccountMeta;
        fTokenMint: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        lendingSupplyPositionOnLiquidity: AccountMeta;
        rateModel: AccountMeta;
        vault: AccountMeta;
        liquidity: AccountMeta;
        liquidityProgram: AccountMeta;
        rewardsRateModel: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: MintWithMaxAssetsInstructionArgs;
}

export function parseMintWithMaxAssetsInstruction(
    instruction: TransactionInstruction,
): ParsedMintWithMaxAssetsInstruction {
    if (instruction.keys.length < 17) {
        throw new Error('Expected 17 account metas for MintWithMaxAssets instruction');
    }
    if (!MINT_WITH_MAX_ASSETS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('MintWithMaxAssets instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            depositorTokenAccount: instruction.keys[1]!,
            recipientTokenAccount: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            lendingAdmin: instruction.keys[4]!,
            lending: instruction.keys[5]!,
            fTokenMint: instruction.keys[6]!,
            supplyTokenReservesLiquidity: instruction.keys[7]!,
            lendingSupplyPositionOnLiquidity: instruction.keys[8]!,
            rateModel: instruction.keys[9]!,
            vault: instruction.keys[10]!,
            liquidity: instruction.keys[11]!,
            liquidityProgram: instruction.keys[12]!,
            rewardsRateModel: instruction.keys[13]!,
            tokenProgram: instruction.keys[14]!,
            associatedTokenProgram: instruction.keys[15]!,
            systemProgram: instruction.keys[16]!,
        },
        data: getMintWithMaxAssetsInstructionDataDecoder().decode(instructionData),
    };
}

export function createMintWithMaxAssetsInstruction(
    accounts: MintWithMaxAssetsInstructionAccounts,
    args: MintWithMaxAssetsInstructionArgs,
    programId: Address = LENDEARN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.depositorTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.recipientTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getMintWithMaxAssetsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MINT_WITH_MAX_ASSETS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
