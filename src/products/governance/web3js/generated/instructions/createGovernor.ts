import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import {
    getGovernanceParametersDecoder,
    getGovernanceParametersEncoder,
    type GovernanceParametersArgs,
} from '../types/governanceParameters';

export const CREATE_GOVERNOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([103, 30, 78, 252, 28, 128, 40, 3]);

export interface CreateGovernorInstructionAccounts {
    base: Address;
    governor: Address;
    smartWallet: Address;
    payer: Address;
    systemProgram: Address;
}

export interface CreateGovernorInstructionArgs {
    locker: Address;
    params: GovernanceParametersArgs;
}

function getCreateGovernorInstructionDataEncoder(): Encoder<CreateGovernorInstructionArgs> {
    return getStructEncoder([
        ['locker', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['params', getGovernanceParametersEncoder()],
    ]);
}

function getCreateGovernorInstructionDataDecoder(): Decoder<CreateGovernorInstructionArgs> {
    return getStructDecoder([
        ['locker', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['params', getGovernanceParametersDecoder()],
    ]);
}

export interface ParsedCreateGovernorInstruction {
    programId: Address;
    accounts: {
        base: AccountMeta;
        governor: AccountMeta;
        smartWallet: AccountMeta;
        payer: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: CreateGovernorInstructionArgs;
}

export function parseCreateGovernorInstruction(instruction: TransactionInstruction): ParsedCreateGovernorInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for CreateGovernor instruction');
    }
    if (!CREATE_GOVERNOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateGovernor instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            base: instruction.keys[0]!,
            governor: instruction.keys[1]!,
            smartWallet: instruction.keys[2]!,
            payer: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: getCreateGovernorInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateGovernorInstruction(
    accounts: CreateGovernorInstructionAccounts,
    args: CreateGovernorInstructionArgs,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: false },
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.smartWallet, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateGovernorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_GOVERNOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
