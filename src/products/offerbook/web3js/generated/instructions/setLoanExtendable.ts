import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const SET_LOAN_EXTENDABLE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([130, 168, 137, 148, 29, 17, 239, 228]);

export interface SetLoanExtendableInstructionAccounts {
    signer: Address;
    loan: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface SetLoanExtendableInstructionArgs {
    allow: boolean;
}

function getSetLoanExtendableInstructionDataEncoder(): Encoder<SetLoanExtendableInstructionArgs> {
    return getStructEncoder([['allow', getBooleanEncoder()]]);
}

function getSetLoanExtendableInstructionDataDecoder(): Decoder<SetLoanExtendableInstructionArgs> {
    return getStructDecoder([['allow', getBooleanDecoder()]]);
}

export interface ParsedSetLoanExtendableInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        loan: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: SetLoanExtendableInstructionArgs;
}

export function parseSetLoanExtendableInstruction(
    instruction: TransactionInstruction,
): ParsedSetLoanExtendableInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for SetLoanExtendable instruction');
    }
    if (!SET_LOAN_EXTENDABLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('SetLoanExtendable instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            loan: instruction.keys[1]!,
            eventAuthority: instruction.keys[2]!,
            program: instruction.keys[3]!,
        },
        data: getSetLoanExtendableInstructionDataDecoder().decode(instructionData),
    };
}

export async function createSetLoanExtendableInstruction(
    accounts: SetLoanExtendableInstructionAccounts,
    args: SetLoanExtendableInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getSetLoanExtendableInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SET_LOAN_EXTENDABLE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
