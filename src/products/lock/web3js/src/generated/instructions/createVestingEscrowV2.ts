import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
    CreateVestingEscrowParameters,
    createVestingEscrowParametersCodec,
} from '../types/createVestingEscrowParameters';
import { LOCKER_PROGRAM_ID } from '..';
import { RemainingAccountsInfo, remainingAccountsInfoCodec } from '../types/remainingAccountsInfo';
import { findEscrowPda } from '../pdas/escrow';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getOptionCodec, getStructCodec } from '@solana/codecs';

export interface CreateVestingEscrowV2InstructionAccounts {
    base: Address;
    escrow?: Address;
    tokenMint: Address;
    escrowToken?: Address;
    sender: Address;
    senderToken: Address;
    recipient: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateVestingEscrowV2InstructionArgs {
    params: CreateVestingEscrowParameters;
    remainingAccountsInfo: RemainingAccountsInfo | null;
}

const CreateVestingEscrowV2InstructionDataCodec = getStructCodec([
    ['params', createVestingEscrowParametersCodec],
    ['remainingAccountsInfo', getOptionCodec(remainingAccountsInfoCodec)],
]);

export async function createCreateVestingEscrowV2Instruction(
    accounts: CreateVestingEscrowV2InstructionAccounts,
    args: CreateVestingEscrowV2InstructionArgs,
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
    let escrowToken = accounts.escrowToken;
    if (!escrowToken) {
        const [derived] = await findEscrowTokenPda(
            {
                escrow: accounts.escrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        escrowToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: true },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.senderToken, isSigner: false, isWritable: true },
        { pubkey: accounts.recipient, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(CreateVestingEscrowV2InstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b59b68b7b680232f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
