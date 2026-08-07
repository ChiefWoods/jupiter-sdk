import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTION_PROGRAM_ID } from '../programs/prediction';
import { findOrderAtaPda } from '../pdas/orderAta';
import { findVaultPda } from '../pdas/vault';

export const CLOSE_ORDER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([90, 103, 209, 28, 7, 63, 168, 4]);

export interface CloseOrderInstructionAccounts {
    owner: Address;
    authority: Address;
    vault?: Address;
    order: Address;
    rentDestination: Address;
    position: Address;
    orderAta?: Address;
    ownerTokenAccount: Address;
    settlementMint: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
}

export interface ParsedCloseOrderInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        authority: AccountMeta;
        vault: AccountMeta;
        order: AccountMeta;
        rentDestination: AccountMeta;
        position: AccountMeta;
        orderAta: AccountMeta;
        ownerTokenAccount: AccountMeta;
        settlementMint: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
    };
    data: {};
}

export function parseCloseOrderInstruction(instruction: TransactionInstruction): ParsedCloseOrderInstruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for CloseOrder instruction');
    }
    if (!CLOSE_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CloseOrder instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            authority: instruction.keys[1]!,
            vault: instruction.keys[2]!,
            order: instruction.keys[3]!,
            rentDestination: instruction.keys[4]!,
            position: instruction.keys[5]!,
            orderAta: instruction.keys[6]!,
            ownerTokenAccount: instruction.keys[7]!,
            settlementMint: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
            associatedTokenProgram: instruction.keys[11]!,
        },
        data: {},
    };
}

export async function createCloseOrderInstruction(
    accounts: CloseOrderInstructionAccounts,
    programId: Address = PREDICTION_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        vault = derived;
    }
    let orderAta = accounts.orderAta;
    if (!orderAta) {
        const [derived] = await findOrderAtaPda({
            order: accounts.order,
            settlementMint: accounts.settlementMint,
        });
        orderAta = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: vault, isSigner: false, isWritable: false },
        { pubkey: accounts.order, isSigner: false, isWritable: true },
        { pubkey: accounts.rentDestination, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: orderAta, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.settlementMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_ORDER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
