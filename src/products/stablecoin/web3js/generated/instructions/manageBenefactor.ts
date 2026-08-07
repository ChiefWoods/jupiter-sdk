import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import {
    getBenefactorManagementActionDecoder,
    getBenefactorManagementActionEncoder,
    type BenefactorManagementActionArgs,
} from '../types/benefactorManagementAction';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const MANAGE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR = new Uint8Array([22, 231, 128, 62, 115, 219, 149, 14]);

export interface ManageBenefactorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    benefactor: Address;
}

export interface ManageBenefactorInstructionArgs {
    action: BenefactorManagementActionArgs;
}

function getManageBenefactorInstructionDataEncoder(): Encoder<ManageBenefactorInstructionArgs> {
    return getStructEncoder([['action', getBenefactorManagementActionEncoder()]]);
}

function getManageBenefactorInstructionDataDecoder(): Decoder<ManageBenefactorInstructionArgs> {
    return getStructDecoder([['action', getBenefactorManagementActionDecoder()]]);
}

export interface ParsedManageBenefactorInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        benefactor: AccountMeta;
    };
    data: ManageBenefactorInstructionArgs;
}

export function parseManageBenefactorInstruction(
    instruction: TransactionInstruction,
): ParsedManageBenefactorInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for ManageBenefactor instruction');
    }
    if (!MANAGE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ManageBenefactor instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            benefactor: instruction.keys[2]!,
        },
        data: getManageBenefactorInstructionDataDecoder().decode(instructionData),
    };
}

export function createManageBenefactorInstruction(
    accounts: ManageBenefactorInstructionAccounts,
    args: ManageBenefactorInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getManageBenefactorInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MANAGE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
