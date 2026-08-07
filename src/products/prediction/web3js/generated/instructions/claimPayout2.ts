import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';

export const CLAIM_PAYOUT2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([141, 205, 99, 203, 142, 231, 87, 226]);

export interface ClaimPayout2InstructionAccounts {
    authority: Address;
    vault: Address;
    position: Address;
    marketResult: Address;
    ownerTokenAccount: Address;
    vaultTokenAccount: Address;
    tokenProgram: Address;
}

export interface ParsedClaimPayout2Instruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vault: AccountMeta;
        position: AccountMeta;
        marketResult: AccountMeta;
        ownerTokenAccount: AccountMeta;
        vaultTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseClaimPayout2Instruction(instruction: TransactionInstruction): ParsedClaimPayout2Instruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for ClaimPayout2 instruction');
    }
    if (!CLAIM_PAYOUT2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimPayout2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vault: instruction.keys[1]!,
            position: instruction.keys[2]!,
            marketResult: instruction.keys[3]!,
            ownerTokenAccount: instruction.keys[4]!,
            vaultTokenAccount: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export function createClaimPayout2Instruction(
    accounts: ClaimPayout2InstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: false },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_PAYOUT2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
