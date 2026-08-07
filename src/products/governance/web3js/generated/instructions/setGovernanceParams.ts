import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    getGovernanceParametersDecoder,
    getGovernanceParametersEncoder,
    type GovernanceParametersArgs,
} from '../types/governanceParameters';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const SET_GOVERNANCE_PARAMS_INSTRUCTION_DISCRIMINATOR = new Uint8Array([175, 187, 3, 73, 8, 251, 67, 178]);

export interface SetGovernanceParamsInstructionAccounts {
    governor: Address;
    smartWallet: Address;
}

export interface SetGovernanceParamsInstructionArgs {
    params: GovernanceParametersArgs;
}

function getSetGovernanceParamsInstructionDataEncoder(): Encoder<SetGovernanceParamsInstructionArgs> {
    return getStructEncoder([['params', getGovernanceParametersEncoder()]]);
}

function getSetGovernanceParamsInstructionDataDecoder(): Decoder<SetGovernanceParamsInstructionArgs> {
    return getStructDecoder([['params', getGovernanceParametersDecoder()]]);
}

export interface ParsedSetGovernanceParamsInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        smartWallet: AccountMeta;
    };
    data: SetGovernanceParamsInstructionArgs;
}

export function parseSetGovernanceParamsInstruction(
    instruction: TransactionInstruction,
): ParsedSetGovernanceParamsInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for SetGovernanceParams instruction');
    }
    if (!SET_GOVERNANCE_PARAMS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetGovernanceParams instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            smartWallet: instruction.keys[1]!,
        },
        data: getSetGovernanceParamsInstructionDataDecoder().decode(instructionData),
    };
}

export function createSetGovernanceParamsInstruction(
    accounts: SetGovernanceParamsInstructionAccounts,
    args: SetGovernanceParamsInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: true, isWritable: false },
    ];
    let data = Buffer.from(getSetGovernanceParamsInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_GOVERNANCE_PARAMS_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
