import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDFLASHLOAN_PROGRAM_ID } from '../programs/lendFlashLoan';
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

export const UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR = new Uint8Array([32, 46, 64, 28, 149, 75, 243, 88]);

export interface UpdateAuthorityInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export interface UpdateAuthorityInstructionArgs {
    newAuthority: Address;
}

function getUpdateAuthorityInstructionDataEncoder(): Encoder<UpdateAuthorityInstructionArgs> {
    return getStructEncoder([
        ['newAuthority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getUpdateAuthorityInstructionDataDecoder(): Decoder<UpdateAuthorityInstructionArgs> {
    return getStructDecoder([
        ['newAuthority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedUpdateAuthorityInstruction {
    programId: Address;
    accounts: {
        authority: AccountMeta;
        flashloanAdmin: AccountMeta;
    };
    data: UpdateAuthorityInstructionArgs;
}

export function parseUpdateAuthorityInstruction(instruction: TransactionInstruction): ParsedUpdateAuthorityInstruction {
    if (instruction.keys.length < 2) {
        throw new Error('Expected 2 account metas for UpdateAuthority instruction');
    }
    if (!UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('UpdateAuthority instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            authority: instruction.keys[0]!,
            flashloanAdmin: instruction.keys[1]!,
        },
        data: getUpdateAuthorityInstructionDataDecoder().decode(instructionData),
    };
}

export function createUpdateAuthorityInstruction(
    accounts: UpdateAuthorityInstructionAccounts,
    args: UpdateAuthorityInstructionArgs,
    programId: Address = LENDFLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
    ];
    let data = Buffer.from(getUpdateAuthorityInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
