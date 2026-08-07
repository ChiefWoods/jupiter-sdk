import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export const ESCROW_CORE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([190, 224, 133, 134, 189, 147, 71, 90]);

export interface EscrowCoreNftDepositInstructionAccounts {
    signer: Address;
    signerUser: Address;
    asset: Address;
    collection?: Address;
    mplCoreProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedEscrowCoreNftDepositInstruction {
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

export function parseEscrowCoreNftDepositInstruction(
    instruction: TransactionInstruction,
): ParsedEscrowCoreNftDepositInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for EscrowCoreNftDeposit instruction');
    }
    if (
        !ESCROW_CORE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('EscrowCoreNftDeposit instruction discriminator mismatch');
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

export async function createEscrowCoreNftDepositInstruction(
    accounts: EscrowCoreNftDepositInstructionAccounts,
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
        Buffer.from(ESCROW_CORE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
