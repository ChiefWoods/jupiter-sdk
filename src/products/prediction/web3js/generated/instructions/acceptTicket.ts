import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    getStructEncoder,
    getU32Encoder,
    getU64Encoder,
    getUtf8Encoder,
    type Encoder,
} from '@solana/codecs';

export interface AcceptTicketInstructionAccounts {
    authority: Address;
    owner: Address;
    vault: Address;
    ticket: Address;
    vaultTokenAccount: Address;
    ticketAta: Address;
    tokenProgram: Address;
}

export interface AcceptTicketInstructionArgs {
    venueTicketId: string;
    maxPayoutUsd: number | bigint;
}

function getAcceptTicketInstructionDataEncoder(): Encoder<AcceptTicketInstructionArgs> {
    return getStructEncoder([
        ['venueTicketId', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['maxPayoutUsd', getU64Encoder()],
    ]);
}

export function createAcceptTicketInstruction(
    accounts: AcceptTicketInstructionAccounts,
    args: AcceptTicketInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getAcceptTicketInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('dd0ee46dcb2f5c33', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
