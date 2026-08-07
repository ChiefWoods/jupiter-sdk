import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';
import { getTokenConfigDecoder, getTokenConfigEncoder, type TokenConfigArgs } from '../types/tokenConfig';

export const UPDATE_TOKEN_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([231, 122, 181, 79, 255, 79, 144, 167]);

export interface UpdateTokenConfigInstructionAccounts {
    authority: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
}

export interface UpdateTokenConfigInstructionArgs {
    tokenConfig: TokenConfigArgs;
}

function getUpdateTokenConfigInstructionDataEncoder(): Encoder<UpdateTokenConfigInstructionArgs> {
    return getStructEncoder([['tokenConfig', getTokenConfigEncoder()]]);
}

function getUpdateTokenConfigInstructionDataDecoder(): Decoder<UpdateTokenConfigInstructionArgs> {
    return getStructDecoder([['tokenConfig', getTokenConfigDecoder()]]);
}

export interface ParsedUpdateTokenConfigInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        rateModel: AccountMeta;
        mint: AccountMeta;
        tokenReserve: AccountMeta;
    };
    data: UpdateTokenConfigInstructionArgs;
}

export function parseUpdateTokenConfigInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateTokenConfigInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for UpdateTokenConfig instruction');
    }
    if (!UPDATE_TOKEN_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateTokenConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
            rateModel: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            tokenReserve: instruction.keys[4]!,
        },
        data: getUpdateTokenConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateTokenConfigInstruction(
    accounts: UpdateTokenConfigInstructionAccounts,
    args: UpdateTokenConfigInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateTokenConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_TOKEN_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
