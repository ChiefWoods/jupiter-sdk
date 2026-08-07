import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDBORROW_PROGRAM_ID } from '../programs/lendBorrow';
import {
    getI32Decoder,
    getI32Encoder,
    getStructDecoder,
    getStructEncoder,
    getU16Decoder,
    getU16Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_TICK_INSTRUCTION_DISCRIMINATOR = new Uint8Array([22, 13, 62, 141, 73, 89, 178, 29]);

export interface InitTickInstructionAccounts {
    signer: Address;
    vaultConfig: Address;
    tickData: Address;
    systemProgram: Address;
}

export interface InitTickInstructionArgs {
    vaultId: number;
    tick: number;
}

function getInitTickInstructionDataEncoder(): Encoder<InitTickInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['tick', getI32Encoder()],
    ]);
}

function getInitTickInstructionDataDecoder(): Decoder<InitTickInstructionArgs> {
    return getStructDecoder([
        ['vaultId', getU16Decoder()],
        ['tick', getI32Decoder()],
    ]);
}

export interface ParsedInitTickInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        vaultConfig: AccountMeta;
        tickData: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitTickInstructionArgs;
}

export function parseInitTickInstruction(instruction: TransactionInstruction): ParsedInitTickInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for InitTick instruction');
    }
    if (!INIT_TICK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitTick instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            vaultConfig: instruction.keys[1]!,
            tickData: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
        },
        data: getInitTickInstructionDataDecoder().decode(instructionData),
    };
}

export function createInitTickInstruction(
    accounts: InitTickInstructionAccounts,
    args: InitTickInstructionArgs,
    programId: Address = LENDBORROW_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.tickData, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitTickInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_TICK_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
