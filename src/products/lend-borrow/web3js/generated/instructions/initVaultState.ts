import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findVaultStatePda } from '../pdas/vaultState';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_VAULT_STATE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([96, 120, 23, 100, 153, 11, 13, 165]);

export interface InitVaultStateInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultConfig: Address;
    vaultState?: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
    systemProgram: Address;
}

export interface InitVaultStateInstructionArgs {
    vaultId: number;
}

function getInitVaultStateInstructionDataEncoder(): Encoder<InitVaultStateInstructionArgs> {
    return getStructEncoder([['vaultId', getU16Encoder()]]);
}

function getInitVaultStateInstructionDataDecoder(): Decoder<InitVaultStateInstructionArgs> {
    return getStructDecoder([['vaultId', getU16Decoder()]]);
}

export interface ParsedInitVaultStateInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        vaultAdmin: AccountMeta;
        vaultConfig: AccountMeta;
        vaultState: AccountMeta;
        supplyTokenReservesLiquidity: AccountMeta;
        borrowTokenReservesLiquidity: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitVaultStateInstructionArgs;
}

export function parseInitVaultStateInstruction(instruction: TransactionInstruction): ParsedInitVaultStateInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for InitVaultState instruction');
    }
    if (!INIT_VAULT_STATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitVaultState instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            vaultAdmin: instruction.keys[1]!,
            vaultConfig: instruction.keys[2]!,
            vaultState: instruction.keys[3]!,
            supplyTokenReservesLiquidity: instruction.keys[4]!,
            borrowTokenReservesLiquidity: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
        },
        data: getInitVaultStateInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitVaultStateInstruction(
    accounts: InitVaultStateInstructionAccounts,
    args: InitVaultStateInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vaultState = accounts.vaultState;
    if (!vaultState) {
        const [derived] = await findVaultStatePda(
            {
                vaultId: args.vaultId,
            },
            programId,
        );
        vaultState = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitVaultStateInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_VAULT_STATE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
