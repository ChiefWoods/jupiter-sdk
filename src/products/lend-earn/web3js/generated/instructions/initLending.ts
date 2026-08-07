import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDEARN_PROGRAM_ID } from '../programs/lendEarn';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { findFTokenMintPda } from '../pdas/fTokenMint';
import { findLendingPda } from '../pdas/lending';
import { findMetadataAccountPda } from '../pdas/metadataAccount';

export const INIT_LENDING_INSTRUCTION_DISCRIMINATOR = new Uint8Array([156, 224, 67, 46, 89, 189, 157, 209]);

export interface InitLendingInstructionAccounts {
    signer: Address;
    lendingAdmin: Address;
    mint: Address;
    fTokenMint?: Address;
    metadataAccount?: Address;
    lending?: Address;
    tokenReservesLiquidity: Address;
    tokenProgram: Address;
    systemProgram: Address;
    sysvarInstruction: Address;
    metadataProgram: Address;
    rent: Address;
}

export interface InitLendingInstructionArgs {
    symbol: string;
    liquidityProgram: Address;
}

function getInitLendingInstructionDataEncoder(): Encoder<InitLendingInstructionArgs> {
    return getStructEncoder([
        ['symbol', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        [
            'liquidityProgram',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
    ]);
}

function getInitLendingInstructionDataDecoder(): Decoder<InitLendingInstructionArgs> {
    return getStructDecoder([
        ['symbol', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['liquidityProgram', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitLendingInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        lendingAdmin: AccountMeta;
        mint: AccountMeta;
        fTokenMint: AccountMeta;
        metadataAccount: AccountMeta;
        lending: AccountMeta;
        tokenReservesLiquidity: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        sysvarInstruction: AccountMeta;
        metadataProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: InitLendingInstructionArgs;
}

export function parseInitLendingInstruction(instruction: TransactionInstruction): ParsedInitLendingInstruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for InitLending instruction');
    }
    if (!INIT_LENDING_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitLending instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            lendingAdmin: instruction.keys[1]!,
            mint: instruction.keys[2]!,
            fTokenMint: instruction.keys[3]!,
            metadataAccount: instruction.keys[4]!,
            lending: instruction.keys[5]!,
            tokenReservesLiquidity: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
            systemProgram: instruction.keys[8]!,
            sysvarInstruction: instruction.keys[9]!,
            metadataProgram: instruction.keys[10]!,
            rent: instruction.keys[11]!,
        },
        data: getInitLendingInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitLendingInstruction(
    accounts: InitLendingInstructionAccounts,
    args: InitLendingInstructionArgs,
    programId: Address = LENDEARN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let fTokenMint = accounts.fTokenMint;
    if (!fTokenMint) {
        const [derived] = await findFTokenMintPda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        fTokenMint = derived;
    }
    let metadataAccount = accounts.metadataAccount;
    if (!metadataAccount) {
        const [derived] = await findMetadataAccountPda({
            fTokenMint: accounts.fTokenMint,
        });
        metadataAccount = derived;
    }
    let lending = accounts.lending;
    if (!lending) {
        const [derived] = await findLendingPda(
            {
                mint: accounts.mint,
                fTokenMint: accounts.fTokenMint,
            },
            programId,
        );
        lending = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: fTokenMint, isSigner: false, isWritable: true },
        { pubkey: metadataAccount, isSigner: false, isWritable: true },
        { pubkey: lending, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.sysvarInstruction, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitLendingInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_LENDING_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
