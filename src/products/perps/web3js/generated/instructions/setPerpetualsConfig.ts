import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import { getPermissionsDecoder, getPermissionsEncoder, type PermissionsArgs } from '../types/permissions';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const SET_PERPETUALS_CONFIG_INSTRUCTION_DISCRIMINATOR = new Uint8Array([80, 72, 21, 191, 29, 121, 45, 111]);

export interface SetPerpetualsConfigInstructionAccounts {
    admin: Address;
    perpetuals: Address;
}

export interface SetPerpetualsConfigInstructionArgs {
    permissions: PermissionsArgs;
}

function getSetPerpetualsConfigInstructionDataEncoder(): Encoder<SetPerpetualsConfigInstructionArgs> {
    return getStructEncoder([['permissions', getPermissionsEncoder()]]);
}

function getSetPerpetualsConfigInstructionDataDecoder(): Decoder<SetPerpetualsConfigInstructionArgs> {
    return getStructDecoder([['permissions', getPermissionsDecoder()]]);
}

export interface ParsedSetPerpetualsConfigInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        perpetuals: AccountMeta;
    };
    data: SetPerpetualsConfigInstructionArgs;
}

export function parseSetPerpetualsConfigInstruction(
    instruction: TransactionInstruction,
): ParsedSetPerpetualsConfigInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetPerpetualsConfig instruction');
    }
    if (!SET_PERPETUALS_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetPerpetualsConfig instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
        },
        data: getSetPerpetualsConfigInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetPerpetualsConfigInstruction(
    accounts: SetPerpetualsConfigInstructionAccounts,
    args: SetPerpetualsConfigInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getSetPerpetualsConfigInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_PERPETUALS_CONFIG_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
