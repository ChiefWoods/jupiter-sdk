import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { INVITEESCROW_PROGRAM_ID } from '../programs/inviteEscrow';

export const EXPIRE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([243, 83, 205, 58, 57, 201, 247, 146]);

export interface ExpireInstructionAccounts {
    inviteInfo: Address;
    sender: Address;
    keeper: Address;
}

export interface ParsedExpireInstruction {
    programId: Address;
    accounts: {
        inviteInfo: AccountMeta;
        sender: AccountMeta;
        keeper: AccountMeta;
    };
    data: {};
}

export function parseExpireInstruction(instruction: TransactionInstruction): ParsedExpireInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for Expire instruction');
    }
    if (!EXPIRE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Expire instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            inviteInfo: instruction.keys[0]!,
            sender: instruction.keys[1]!,
            keeper: instruction.keys[2]!,
        },
        data: {},
    };
}

export function createExpireInstruction(
    accounts: ExpireInstructionAccounts,
    programId: Address = INVITEESCROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.inviteInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: false, isWritable: true },
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(EXPIRE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
