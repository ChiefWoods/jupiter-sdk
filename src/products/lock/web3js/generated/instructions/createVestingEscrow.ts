import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEscrowPda } from '../pdas/escrow';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getCreateVestingEscrowParametersDecoder,
    getCreateVestingEscrowParametersEncoder,
    type CreateVestingEscrowParametersArgs,
} from '../types/createVestingEscrowParameters';
import { getStructDecoder, getStructEncoder, type Decoder, type Encoder } from '@solana/codecs';

export const CREATE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([23, 100, 197, 94, 222, 153, 38, 90]);

export interface CreateVestingEscrowInstructionAccounts {
    base: Address;
    escrow?: Address;
    escrowToken: Address;
    sender: Address;
    senderToken: Address;
    recipient: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateVestingEscrowInstructionArgs {
    params: CreateVestingEscrowParametersArgs;
}

function getCreateVestingEscrowInstructionDataEncoder(): Encoder<CreateVestingEscrowInstructionArgs> {
    return getStructEncoder([['params', getCreateVestingEscrowParametersEncoder()]]);
}

function getCreateVestingEscrowInstructionDataDecoder(): Decoder<CreateVestingEscrowInstructionArgs> {
    return getStructDecoder([['params', getCreateVestingEscrowParametersDecoder()]]);
}

export interface ParsedCreateVestingEscrowInstruction {
    programId: Address;
    accounts: {
        base: AccountMeta;
        escrow: AccountMeta;
        escrowToken: AccountMeta;
        sender: AccountMeta;
        senderToken: AccountMeta;
        recipient: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateVestingEscrowInstructionArgs;
}

export function parseCreateVestingEscrowInstruction(
    instruction: TransactionInstruction,
): ParsedCreateVestingEscrowInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for CreateVestingEscrow instruction');
    }
    if (!CREATE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CreateVestingEscrow instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            base: instruction.keys[0]!,
            escrow: instruction.keys[1]!,
            escrowToken: instruction.keys[2]!,
            sender: instruction.keys[3]!,
            senderToken: instruction.keys[4]!,
            recipient: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getCreateVestingEscrowInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateVestingEscrowInstruction(
    accounts: CreateVestingEscrowInstructionAccounts,
    args: CreateVestingEscrowInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrow = accounts.escrow;
    if (!escrow) {
        const [derived] = await findEscrowPda(
            {
                base: accounts.base,
            },
            programId,
        );
        escrow = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: true },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.senderToken, isSigner: false, isWritable: true },
        { pubkey: accounts.recipient, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateVestingEscrowInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_VESTING_ESCROW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
