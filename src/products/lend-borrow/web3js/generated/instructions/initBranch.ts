import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findBranchPda } from '../pdas/branch';
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

export const INIT_BRANCH_INSTRUCTION_DISCRIMINATOR = new Uint8Array([162, 91, 57, 23, 228, 93, 111, 21]);

export interface InitBranchInstructionAccounts {
    signer: Address;
    vaultConfig: Address;
    branch?: Address;
    systemProgram: Address;
}

export interface InitBranchInstructionArgs {
    vaultId: number;
    branchId: number;
}

function getInitBranchInstructionDataEncoder(): Encoder<InitBranchInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['branchId', getU32Encoder()],
    ]);
}

function getInitBranchInstructionDataDecoder(): Decoder<InitBranchInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['branchId', getU32Decoder()],
    ]);
}

export interface ParsedInitBranchInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        vaultConfig: AccountMeta;
        branch: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitBranchInstructionArgs;
}

export function parseInitBranchInstruction(instruction: TransactionInstruction): ParsedInitBranchInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitBranch instruction');
    }
    if (!INIT_BRANCH_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitBranch instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            vaultConfig: instruction.keys[1]!,
            branch: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitBranchInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitBranchInstruction(
    accounts: InitBranchInstructionAccounts,
    args: InitBranchInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let branch = accounts.branch;
    if (!branch) {
        const [derived] = await findBranchPda(
            {
                vaultId: args.vaultId,
                branchId: args.branchId,
            },
            programId,
        );
        branch = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: branch, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitBranchInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_BRANCH_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
