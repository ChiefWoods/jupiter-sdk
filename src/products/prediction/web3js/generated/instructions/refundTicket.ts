import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface RefundTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    vaultTokenAccount: Address;
    ticketAta: Address;
    ownerTokenAccount: Address;
    tokenProgram: Address;
}

export interface RefundTicketInstructionArgs {
    refundUsd: number | bigint;
}

function getRefundTicketInstructionDataEncoder(): Encoder<RefundTicketInstructionArgs> {
    return getStructEncoder([['refundUsd', getU64Encoder()]]);
}

export function createRefundTicketInstruction(
    accounts: RefundTicketInstructionAccounts,
    args: RefundTicketInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getRefundTicketInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b2614bdae31c1549', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
