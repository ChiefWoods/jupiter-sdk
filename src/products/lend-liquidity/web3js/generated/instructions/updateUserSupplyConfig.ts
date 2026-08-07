import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';
import {
    getUserSupplyConfigDecoder,
    getUserSupplyConfigEncoder,
    type UserSupplyConfigArgs,
} from '../types/userSupplyConfig';

export const UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    217, 239, 225, 218, 33, 49, 234, 183,
]);

export interface UpdateUserSupplyConfigInstructionAccounts {
    authority: Address;
    protocol: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
    userSupplyPosition: Address;
}

export interface UpdateUserSupplyConfigInstructionArgs {
    userSupplyConfig: UserSupplyConfigArgs;
}

function getUpdateUserSupplyConfigInstructionDataEncoder(): Encoder<UpdateUserSupplyConfigInstructionArgs> {
    return getStructEncoder([['userSupplyConfig', getUserSupplyConfigEncoder()]]);
}

function getUpdateUserSupplyConfigInstructionDataDecoder(): Decoder<UpdateUserSupplyConfigInstructionArgs> {
    return getStructDecoder([['userSupplyConfig', getUserSupplyConfigDecoder()]]);
}

export interface ParsedUpdateUserSupplyConfigInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        protocol: AccountMeta;
        authList: AccountMeta;
        rateModel: AccountMeta;
        mint: AccountMeta;
        tokenReserve: AccountMeta;
        userSupplyPosition: AccountMeta;
    };
    data: UpdateUserSupplyConfigInstructionArgs;
}

export function parseUpdateUserSupplyConfigInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateUserSupplyConfigInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for UpdateUserSupplyConfig instruction');
    }
    if (
        !UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateUserSupplyConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            protocol: instruction.keys[1]!,
            authList: instruction.keys[2]!,
            rateModel: instruction.keys[3]!,
            mint: instruction.keys[4]!,
            tokenReserve: instruction.keys[5]!,
            userSupplyPosition: instruction.keys[6]!,
        },
        data: getUpdateUserSupplyConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateUserSupplyConfigInstruction(
    accounts: UpdateUserSupplyConfigInstructionAccounts,
    args: UpdateUserSupplyConfigInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.protocol, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.userSupplyPosition, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateUserSupplyConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
