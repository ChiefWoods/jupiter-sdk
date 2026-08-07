import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getUtf8Decoder,
    getUtf8Encoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export const UPDATE_VESTING_ESCROW_RECIPIENT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    26, 242, 127, 255, 237, 109, 47, 206,
]);

export interface UpdateVestingEscrowRecipientInstructionAccounts {
    escrow: Address;
    escrowMetadata?: Address;
    signer: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface UpdateVestingEscrowRecipientInstructionArgs {
    newRecipient: Address;
    newRecipientEmail: OptionOrNullable<string>;
}

function getUpdateVestingEscrowRecipientInstructionDataEncoder(): Encoder<UpdateVestingEscrowRecipientInstructionArgs> {
    return getStructEncoder([
        ['newRecipient', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['newRecipientEmail', getOptionEncoder(addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder()))],
    ]);
}

function getUpdateVestingEscrowRecipientInstructionDataDecoder(): Decoder<UpdateVestingEscrowRecipientInstructionArgs> {
    return getStructDecoder([
        ['newRecipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['newRecipientEmail', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
    ]);
}

export interface ParsedUpdateVestingEscrowRecipientInstruction {
    programId: Address;
    accounts: {
        escrow: AccountMeta;
        escrowMetadata: AccountMeta;
        signer: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: UpdateVestingEscrowRecipientInstructionArgs;
}

export function parseUpdateVestingEscrowRecipientInstruction(
    instruction: TransactionInstruction,
): ParsedUpdateVestingEscrowRecipientInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for UpdateVestingEscrowRecipient instruction');
    }
    if (
        !UPDATE_VESTING_ESCROW_RECIPIENT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('UpdateVestingEscrowRecipient instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            escrow: instruction.keys[0]!,
            escrowMetadata: instruction.keys[1]!,
            signer: instruction.keys[2]!,
            systemProgram: instruction.keys[3]!,
            eventAuthority: instruction.keys[4]!,
            program: instruction.keys[5]!,
        },
        data: getUpdateVestingEscrowRecipientInstructionDataDecoder().decode(instructionData),
    };
}

export async function createUpdateVestingEscrowRecipientInstruction(
    accounts: UpdateVestingEscrowRecipientInstructionAccounts,
    args: UpdateVestingEscrowRecipientInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        accounts.escrowMetadata
            ? { pubkey: accounts.escrowMetadata, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getUpdateVestingEscrowRecipientInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_VESTING_ESCROW_RECIPIENT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
