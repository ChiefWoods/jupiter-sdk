import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import {
    getConfigManagementActionDecoder,
    getConfigManagementActionEncoder,
    type ConfigManagementActionArgs,
} from '../types/configManagementAction';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const MANAGE_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([119, 51, 144, 55, 24, 242, 232, 231]);

export interface ManageConfigInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    config: Address;
}

export interface ManageConfigInstructionArgs {
    action: ConfigManagementActionArgs;
}

function getManageConfigInstructionDataEncoder(): Encoder<ManageConfigInstructionArgs> {
    return getStructEncoder([['action', getConfigManagementActionEncoder()]]);
}

function getManageConfigInstructionDataDecoder(): Decoder<ManageConfigInstructionArgs> {
    return getStructDecoder([['action', getConfigManagementActionDecoder()]]);
}

export interface ParsedManageConfigInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        config: AccountMeta;
    };
    data: ManageConfigInstructionArgs;
}

export function parseManageConfigInstruction(instruction: TransactionInstruction): ParsedManageConfigInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for ManageConfig instruction');
    }
    if (!MANAGE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ManageConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            config: instruction.keys[2]!,
        },
        data: getManageConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createManageConfigInstruction(
    accounts: ManageConfigInstructionAccounts,
    args: ManageConfigInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getManageConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MANAGE_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
