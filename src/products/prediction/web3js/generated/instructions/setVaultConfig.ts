import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SET_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([65, 5, 248, 136, 48, 58, 235, 231]);

export interface SetVaultConfigInstructionAccounts {
    admin: Address;
    vault: Address;
}

export interface SetVaultConfigInstructionArgs {
    globalMaxContracts: number | bigint;
    positionMaxContracts: number | bigint;
    positionMaxOrders: number;
    protocolFeeBps: number;
    settlementDelaySeconds: number | bigint;
    depositsDisabled: boolean;
    withdrawalsDisabled: boolean;
    tradingDisabled: boolean;
}

function getSetVaultConfigInstructionDataEncoder(): Encoder<SetVaultConfigInstructionArgs> {
    return getStructEncoder([
        ['globalMaxContracts', getU64Encoder()],
        ['positionMaxContracts', getU64Encoder()],
        ['positionMaxOrders', getU32Encoder()],
        ['protocolFeeBps', getU16Encoder()],
        ['settlementDelaySeconds', getU64Encoder()],
        ['depositsDisabled', getBooleanEncoder()],
        ['withdrawalsDisabled', getBooleanEncoder()],
        ['tradingDisabled', getBooleanEncoder()],
    ]);
}

function getSetVaultConfigInstructionDataDecoder(): Decoder<SetVaultConfigInstructionArgs> {
    return getStructDecoder([
        ['globalMaxContracts', getU64Decoder()],
        ['positionMaxContracts', getU64Decoder()],
        ['positionMaxOrders', getU32Decoder()],
        ['protocolFeeBps', getU16Decoder()],
        ['settlementDelaySeconds', getU64Decoder()],
        ['depositsDisabled', getBooleanDecoder()],
        ['withdrawalsDisabled', getBooleanDecoder()],
        ['tradingDisabled', getBooleanDecoder()],
    ]);
}

export interface ParsedSetVaultConfigInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        vault: AccountMeta;
    };
    data: SetVaultConfigInstructionArgs;
}

export function parseSetVaultConfigInstruction(instruction: TransactionInstruction): ParsedSetVaultConfigInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetVaultConfig instruction');
    }
    if (!SET_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetVaultConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            vault: instruction.keys[1]!,
        },
        data: getSetVaultConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetVaultConfigInstruction(
    accounts: SetVaultConfigInstructionAccounts,
    args: SetVaultConfigInstructionArgs,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSetVaultConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
