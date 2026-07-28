import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface EscrowTokenWithdrawInstructionAccounts {
    signer: Address;
    signerTokenAccount: Address;
    signerUser: Address;
    userEscrowTokenAccount: Address;
    mint: Address;
    tokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface EscrowTokenWithdrawInstructionArgs {
    amount: number | bigint;
}

function getEscrowTokenWithdrawInstructionDataEncoder(): Encoder<EscrowTokenWithdrawInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

export async function createEscrowTokenWithdrawInstruction(
    accounts: EscrowTokenWithdrawInstructionAccounts,
    args: EscrowTokenWithdrawInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.signerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.userEscrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getEscrowTokenWithdrawInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b7cc0e45114cdf69', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
