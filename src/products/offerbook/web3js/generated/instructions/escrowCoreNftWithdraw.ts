import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export const ESCROW_CORE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([171, 155, 79, 152, 236, 174, 29, 57]);

export interface EscrowCoreNftWithdrawInstructionAccounts {
    signer: Address;
    signerUser: Address;
    asset: Address;
    collection?: Address;
    mplCoreProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedEscrowCoreNftWithdrawInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        asset: AccountMeta;
        collection: AccountMeta;
        mplCoreProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseEscrowCoreNftWithdrawInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowCoreNftWithdrawInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for EscrowCoreNftWithdraw instruction');
    }
    if (
        !ESCROW_CORE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('EscrowCoreNftWithdraw instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            asset: instruction.keys[2]!,
            collection: instruction.keys[3]!,
            mplCoreProgram: instruction.keys[4]!,
            systemProgram: instruction.keys[5]!,
            eventAuthority: instruction.keys[6]!,
            program: instruction.keys[7]!,
        },
        data: {},
    };
}

export async function createEscrowCoreNftWithdrawInstruction(
    accounts: EscrowCoreNftWithdrawInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.asset, isSigner: false, isWritable: true },
        accounts.collection
            ? { pubkey: accounts.collection, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.mplCoreProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(ESCROW_CORE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
