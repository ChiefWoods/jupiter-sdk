import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getU64Codec,
    getUtf8Codec,
} from '@solana/codecs';
import { findTicketAtaPda } from '../pdas/ticketAta';
import { findVaultPda } from '../pdas/vault';

export interface CreateTicketInstructionAccounts {
    payer: Address;
    owner: Address;
    authority: Address;
    vault?: Address;
    ticket: Address;
    ownerTokenAccount: Address;
    settlementMint: Address;
    ticketAta?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface CreateTicketInstructionArgs {
    ticketId: string;
    ticketIdHash: Uint8Array;
    marketId: string;
    stakeUsd: bigint;
}

const CreateTicketInstructionDataCodec = getStructCodec([
    ['ticketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['ticketIdHash', fixCodecSize(getBytesCodec(), 32)],
    ['marketId', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['stakeUsd', getU64Codec()],
]);

export async function createCreateTicketInstruction(
    accounts: CreateTicketInstructionAccounts,
    args: CreateTicketInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vault = accounts.vault;
    if (!vault) {
        const [derived] = await findVaultPda(
            {
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        vault = derived;
    }
    let ticketAta = accounts.ticketAta;
    if (!ticketAta) {
        const [derived] = await findTicketAtaPda(
            {
                ticket: accounts.ticket,
                settlementMint: accounts.settlementMint,
            },
            programId,
        );
        ticketAta = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: vault, isSigner: false, isWritable: false },
        { pubkey: accounts.ticket, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.settlementMint, isSigner: false, isWritable: false },
        { pubkey: ticketAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(CreateTicketInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('10b27a19d5556081', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
