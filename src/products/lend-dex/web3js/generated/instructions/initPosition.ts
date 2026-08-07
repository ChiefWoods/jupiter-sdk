import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDDEX_PROGRAM_ID } from '../programs/lendDex';
import { findPositionPda } from '../pdas/position';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([197, 20, 10, 1, 97, 160, 177, 91]);

export interface InitPositionInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position?: Address;
    systemProgram: Address;
}

export interface InitPositionInstructionArgs {
    protocol: Address;
}

function getInitPositionInstructionDataEncoder(): Encoder<InitPositionInstructionArgs> {
    return getStructEncoder([
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitPositionInstructionDataDecoder(): Decoder<InitPositionInstructionArgs> {
    return getStructDecoder([
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitPositionInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        dexAdmin: AccountMeta;
        dex: AccountMeta;
        position: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitPositionInstructionArgs;
}

export function parseInitPositionInstruction(instruction: TransactionInstruction): ParsedInitPositionInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for InitPosition instruction');
    }
    if (!INIT_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitPosition instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            dexAdmin: instruction.keys[1]!,
            dex: instruction.keys[2]!,
            position: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: getInitPositionInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitPositionInstruction(
    accounts: InitPositionInstructionAccounts,
    args: InitPositionInstructionArgs,
    programId: Address = LENDDEX_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let position = accounts.position;
    if (!position) {
        const [derived] = await findPositionPda(
            {
                dex: accounts.dex,
                protocol: args.protocol,
            },
            programId,
        );
        position = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: position, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitPositionInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
