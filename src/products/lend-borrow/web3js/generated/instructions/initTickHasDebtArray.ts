import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import { findTickHasDebtArrayPda } from '../pdas/tickHasDebtArray';
import {
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_TICK_HAS_DEBT_ARRAY_INSTRUCTION_DISCRIMINATOR = new Uint8Array([206, 108, 146, 245, 20, 0, 141, 208]);

export interface InitTickHasDebtArrayInstructionAccounts {
    signer: Address;
    vaultConfig: Address;
    tickHasDebtArray?: Address;
    systemProgram: Address;
}

export interface InitTickHasDebtArrayInstructionArgs {
    vaultId: number;
    index: number;
}

function getInitTickHasDebtArrayInstructionDataEncoder(): Encoder<InitTickHasDebtArrayInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['index', getU8Encoder()],
    ]);
}

function getInitTickHasDebtArrayInstructionDataDecoder(): Decoder<InitTickHasDebtArrayInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['index', getU8Decoder()],
    ]);
}

export interface ParsedInitTickHasDebtArrayInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        vaultConfig: AccountMeta;
        tickHasDebtArray: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitTickHasDebtArrayInstructionArgs;
}

export function parseInitTickHasDebtArrayInstruction(
    instruction: TransactionInstruction,
): ParsedInitTickHasDebtArrayInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitTickHasDebtArray instruction');
    }
    if (
        !INIT_TICK_HAS_DEBT_ARRAY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('InitTickHasDebtArray instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            vaultConfig: instruction.keys[1]!,
            tickHasDebtArray: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitTickHasDebtArrayInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitTickHasDebtArrayInstruction(
    accounts: InitTickHasDebtArrayInstructionAccounts,
    args: InitTickHasDebtArrayInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let tickHasDebtArray = accounts.tickHasDebtArray;
    if (!tickHasDebtArray) {
        const [derived] = await findTickHasDebtArrayPda(
            {
                vaultId: args.vaultId,
                index: args.index,
            },
            programId,
        );
        tickHasDebtArray = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: tickHasDebtArray, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitTickHasDebtArrayInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_TICK_HAS_DEBT_ARRAY_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
