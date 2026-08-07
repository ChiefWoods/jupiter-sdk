import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findMetadataAccountPda } from '../pdas/metadataAccount';
import { findPositionMintPda } from '../pdas/positionMint';
import { findPositionPda } from '../pdas/position';
import { findPositionTokenAccountPda } from '../pdas/positionTokenAccount';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([197, 20, 10, 1, 97, 160, 177, 91]);

export interface InitPositionInstructionAccounts {
    signer: Address;
    vaultAdmin: Address;
    vaultState: Address;
    position?: Address;
    positionMint?: Address;
    positionTokenAccount?: Address;
    metadataAccount?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    sysvarInstruction: Address;
    metadataProgram: Address;
    rent: Address;
}

export interface InitPositionInstructionArgs {
    vaultId: number;
    nextPositionId: number;
}

function getInitPositionInstructionDataEncoder(): Encoder<InitPositionInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['nextPositionId', getU32Encoder()],
    ]);
}

function getInitPositionInstructionDataDecoder(): Decoder<InitPositionInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['nextPositionId', getU32Decoder()],
    ]);
}

export interface ParsedInitPositionInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultState: AccountMeta;
        position: AccountMeta;
        positionMint: AccountMeta;
        positionTokenAccount: AccountMeta;
        metadataAccount: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        sysvarInstruction: AccountMeta;
        metadataProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: InitPositionInstructionArgs;
}

export function parseInitPositionInstruction(instruction: TransactionInstruction): ParsedInitPositionInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for InitPosition instruction');
    }
    if (!INIT_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitPosition instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultState: instruction.keys[2]!,
            position: instruction.keys[3]!,
            positionMint: instruction.keys[4]!,
            positionTokenAccount: instruction.keys[5]!,
            metadataAccount: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
            associatedTokenProgram: instruction.keys[8]!,
            systemProgram: instruction.keys[9]!,
            sysvarInstruction: instruction.keys[10]!,
            metadataProgram: instruction.keys[11]!,
            rent: instruction.keys[12]!,
        },
        data: getInitPositionInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitPositionInstruction(
    accounts: InitPositionInstructionAccounts,
    args: InitPositionInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let position = accounts.position;
    if (!position) {
        const [derived] = await findPositionPda(
            {
                vaultId: args.vaultId,
                nextPositionId: args.nextPositionId,
            },
            programId,
        );
        position = derived;
    }
    let positionMint = accounts.positionMint;
    if (!positionMint) {
        const [derived] = await findPositionMintPda(
            {
                vaultId: args.vaultId,
                nextPositionId: args.nextPositionId,
            },
            programId,
        );
        positionMint = derived;
    }
    let positionTokenAccount = accounts.positionTokenAccount;
    if (!positionTokenAccount) {
        const [derived] = await findPositionTokenAccountPda({
            signer: accounts.signer,
            positionMint: accounts.positionMint,
        });
        positionTokenAccount = derived;
    }
    let metadataAccount = accounts.metadataAccount;
    if (!metadataAccount) {
        const [derived] = await findMetadataAccountPda({
            positionMint: accounts.positionMint,
        });
        metadataAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: position, isSigner: false, isWritable: true },
        { pubkey: positionMint, isSigner: false, isWritable: true },
        { pubkey: positionTokenAccount, isSigner: false, isWritable: true },
        { pubkey: metadataAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.sysvarInstruction, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitPositionInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
