import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export const CANCEL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([92, 203, 223, 40, 92, 89, 53, 119]);

export interface CancelOfferInstructionAccounts {
    creator: Address;
    offer: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedCancelOfferInstruction {
    programId: Address;
    accounts: {
        creator: AccountMeta;
        offer: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseCancelOfferInstruction(instruction: TransactionInstruction): ParsedCancelOfferInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for CancelOffer instruction');
    }
    if (!CANCEL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('CancelOffer instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            creator: instruction.keys[0]!,
            offer: instruction.keys[1]!,
            eventAuthority: instruction.keys[2]!,
            program: instruction.keys[3]!,
        },
        data: {},
    };
}

export async function createCancelOfferInstruction(
    accounts: CancelOfferInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.creator, isSigner: true, isWritable: true },
        { pubkey: accounts.offer, isSigner: false, isWritable: true },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CANCEL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
