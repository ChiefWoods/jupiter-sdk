import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU8Decoder,
    getU8Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { findAuthorityPda } from '../pdas/authority';
import { findConfigPda } from '../pdas/config';
import { findOperatorPda } from '../pdas/operator';

export const INIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([220, 59, 207, 236, 108, 250, 47, 100]);

export interface InitInstructionAccounts {
    payer: Address;
    upgradeAuthority: Address;
    operator?: Address;
    config?: Address;
    authority?: Address;
    mint: Address;
    metadata: Address;
    programData: Address;
    program: Address;
    metadataProgram: Address;
    tokenProgram: Address;
    systemProgram: Address;
    rent: Address;
}

export interface InitInstructionArgs {
    decimals: number;
    name: string;
    symbol: string;
    uri: string;
}

function getInitInstructionDataEncoder(): Encoder<InitInstructionArgs> {
    return getStructEncoder([
        ['decimals', getU8Encoder()],
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['symbol', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['uri', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

function getInitInstructionDataDecoder(): Decoder<InitInstructionArgs> {
    return getStructDecoder([
        ['decimals', getU8Decoder()],
        ['name', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['symbol', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
        ['uri', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
    ]);
}

export interface ParsedInitInstruction {
    programId: Address;
    accounts: {
        payer: AccountMeta;
        upgradeAuthority: AccountMeta;
        operator: AccountMeta;
        config: AccountMeta;
        authority: AccountMeta;
        mint: AccountMeta;
        metadata: AccountMeta;
        programData: AccountMeta;
        program: AccountMeta;
        metadataProgram: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        rent: AccountMeta;
    };
    data: InitInstructionArgs;
}

export function parseInitInstruction(instruction: TransactionInstruction): ParsedInitInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for Init instruction');
    }
    if (!INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Init instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            payer: instruction.keys[0]!,
            upgradeAuthority: instruction.keys[1]!,
            operator: instruction.keys[2]!,
            config: instruction.keys[3]!,
            authority: instruction.keys[4]!,
            mint: instruction.keys[5]!,
            metadata: instruction.keys[6]!,
            programData: instruction.keys[7]!,
            program: instruction.keys[8]!,
            metadataProgram: instruction.keys[9]!,
            tokenProgram: instruction.keys[10]!,
            systemProgram: instruction.keys[11]!,
            rent: instruction.keys[12]!,
        },
        data: getInitInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitInstruction(
    accounts: InitInstructionAccounts,
    args: InitInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let operator = accounts.operator;
    if (!operator) {
        const [derived] = await findOperatorPda(
            {
                upgradeAuthority: accounts.upgradeAuthority,
            },
            programId,
        );
        operator = derived;
    }
    let config = accounts.config;
    if (!config) {
        const [derived] = await findConfigPda(programId);
        config = derived;
    }
    let authority = accounts.authority;
    if (!authority) {
        const [derived] = await findAuthorityPda(programId);
        authority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: false },
        { pubkey: operator, isSigner: false, isWritable: true },
        { pubkey: config, isSigner: false, isWritable: true },
        { pubkey: authority, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: true, isWritable: true },
        { pubkey: accounts.metadata, isSigner: false, isWritable: true },
        { pubkey: accounts.programData, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
