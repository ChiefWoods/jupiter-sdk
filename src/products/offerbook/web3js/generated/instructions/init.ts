import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findConfigPda } from '../pdas/config';
import { findFeeAuthorityPda } from '../pdas/feeAuthority';

export const INIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([220, 59, 207, 236, 108, 250, 47, 100]);

export interface InitInstructionAccounts {
    payer: Address;
    upgradeAuthority: Address;
    config?: Address;
    feeAuthority?: Address;
    programData: Address;
    program: Address;
    systemProgram: Address;
}

export interface ParsedInitInstruction {
    programId: Address;
    accounts: {
        payer: AccountMeta;
        upgradeAuthority: AccountMeta;
        config: AccountMeta;
        feeAuthority: AccountMeta;
        programData: AccountMeta;
        program: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseInitInstruction(instruction: TransactionInstruction): ParsedInitInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for Init instruction');
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
            config: instruction.keys[2]!,
            feeAuthority: instruction.keys[3]!,
            programData: instruction.keys[4]!,
            program: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export async function createInitInstruction(
    accounts: InitInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let config = accounts.config;
    if (!config) {
        const [derived] = await findConfigPda(programId);
        config = derived;
    }
    let feeAuthority = accounts.feeAuthority;
    if (!feeAuthority) {
        const [derived] = await findFeeAuthorityPda(programId);
        feeAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: false },
        { pubkey: config, isSigner: false, isWritable: true },
        { pubkey: feeAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.programData, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
