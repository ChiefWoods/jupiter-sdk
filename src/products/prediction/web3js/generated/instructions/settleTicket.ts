import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface SettleTicketInstructionAccounts {
    authority: Address;
    vault: Address;
    ticket: Address;
}

export interface SettleTicketInstructionArgs {
    payoutUsd: number | bigint;
}

function getSettleTicketInstructionDataEncoder(): Encoder<SettleTicketInstructionArgs> {
    return getStructEncoder([['payoutUsd', getU64Encoder()]]);
}

export function createSettleTicketInstruction(
    accounts: SettleTicketInstructionAccounts,
    args: SettleTicketInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSettleTicketInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('c9507791d0b8a846', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
