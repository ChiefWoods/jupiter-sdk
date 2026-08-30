import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';

export const CLAIM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([62, 198, 214, 193, 213, 159, 108, 210]);

export interface ClaimInstructionAccounts {
    inviteInfo: Address;
    inviteSigner: Address;
    claimer: Address;
    systemProgram: Address;
    keeper: Address;
}

export interface ParsedClaimInstruction {
    programId: Address;
    accounts: {
        inviteInfo: AccountMeta;
        inviteSigner: AccountMeta;
        claimer: AccountMeta;
        systemProgram: AccountMeta;
        keeper: AccountMeta;
    };
    data: {};
}

export function parseClaimInstruction(instruction: TransactionInstruction): ParsedClaimInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for Claim instruction');
    }
    if (!CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Claim instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            inviteInfo: instruction.keys[0]!,
            inviteSigner: instruction.keys[1]!,
            claimer: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
            keeper: instruction.keys[4]!,
        },
        data: {},
    };
}

export function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.inviteSigner, isSigner: true, isWritable: false },
        { pubkey: accounts.claimer, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
