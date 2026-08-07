import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { findUserBorrowPositionPda } from '../pdas/userBorrowPosition';
import { findUserSupplyPositionPda } from '../pdas/userSupplyPosition';
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

export const INIT_NEW_PROTOCOL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([193, 147, 5, 32, 138, 135, 213, 158]);

export interface InitNewProtocolInstructionAccounts {
    authority: Address;
    authList: Address;
    userSupplyPosition?: Address;
    userBorrowPosition?: Address;
    systemProgram: Address;
}

export interface InitNewProtocolInstructionArgs {
    supplyMint: Address;
    borrowMint: Address;
    protocol: Address;
}

function getInitNewProtocolInstructionDataEncoder(): Encoder<InitNewProtocolInstructionArgs> {
    return getStructEncoder([
        ['supplyMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['borrowMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['protocol', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitNewProtocolInstructionDataDecoder(): Decoder<InitNewProtocolInstructionArgs> {
    return getStructDecoder([
        ['supplyMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['borrowMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitNewProtocolInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        authList: AccountMeta;
        userSupplyPosition: AccountMeta;
        userBorrowPosition: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitNewProtocolInstructionArgs;
}

export function parseInitNewProtocolInstruction(instruction: TransactionInstruction): ParsedInitNewProtocolInstruction {
    if (instruction.keys.length < 5) {
        throw new Error('Expected 5 account metas for InitNewProtocol instruction');
    }
    if (!INIT_NEW_PROTOCOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitNewProtocol instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            authList: instruction.keys[1]!,
            userSupplyPosition: instruction.keys[2]!,
            userBorrowPosition: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
        },
        data: getInitNewProtocolInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitNewProtocolInstruction(
    accounts: InitNewProtocolInstructionAccounts,
    args: InitNewProtocolInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let userSupplyPosition = accounts.userSupplyPosition;
    if (!userSupplyPosition) {
        const [derived] = await findUserSupplyPositionPda(
            {
                supplyMint: args.supplyMint,
                protocol: args.protocol,
            },
            programId,
        );
        userSupplyPosition = derived;
    }
    let userBorrowPosition = accounts.userBorrowPosition;
    if (!userBorrowPosition) {
        const [derived] = await findUserBorrowPositionPda(
            {
                borrowMint: args.borrowMint,
                protocol: args.protocol,
            },
            programId,
        );
        userBorrowPosition = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: userSupplyPosition, isSigner: false, isWritable: true },
        { pubkey: userBorrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitNewProtocolInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_NEW_PROTOCOL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
