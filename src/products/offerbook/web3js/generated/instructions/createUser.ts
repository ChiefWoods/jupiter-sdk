import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findSignerUserPda } from '../pdas/signerUser';

export const CREATE_USER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([108, 227, 130, 130, 252, 109, 75, 218]);

export interface CreateUserInstructionAccounts {
    signer: Address;
    signerUser?: Address;
    referrer?: Address;
    referrerUser?: Address;
    config: Address;
    systemProgram: Address;
}

export interface ParsedCreateUserInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        referrer: AccountMeta;
        referrerUser: AccountMeta;
        config: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: {};
}

export function parseCreateUserInstruction(instruction: TransactionInstruction): ParsedCreateUserInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for CreateUser instruction');
    }
    if (!CREATE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateUser instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            referrer: instruction.keys[2]!,
            referrerUser: instruction.keys[3]!,
            config: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
        },
        data: {},
    };
}

export async function createCreateUserInstruction(
    accounts: CreateUserInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let signerUser = accounts.signerUser;
    if (!signerUser) {
        const [derived] = await findSignerUserPda(
            {
                signer: accounts.signer,
            },
            programId,
        );
        signerUser = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: signerUser, isSigner: false, isWritable: true },
        accounts.referrer
            ? { pubkey: accounts.referrer, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.referrerUser
            ? { pubkey: accounts.referrerUser, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_USER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
