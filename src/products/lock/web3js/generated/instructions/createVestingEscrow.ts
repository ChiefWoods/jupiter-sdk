import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findEscrowPda } from '../pdas/escrow';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getCreateVestingEscrowParametersEncoder,
    type CreateVestingEscrowParametersArgs,
} from '../types/createVestingEscrowParameters';
import { getStructEncoder, type Encoder } from '@solana/codecs';

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

export async function createCreateVestingEscrowInstruction(
    accounts: CreateVestingEscrowInstructionAccounts,
    args: CreateVestingEscrowInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
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
    const instructionData = Buffer.from(getCreateVestingEscrowInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('1764c55ede99265a', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
