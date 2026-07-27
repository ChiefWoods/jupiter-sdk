import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPITER_PROGRAM_ID } from '..';
import { findDestinationTokenAccountPda } from '../pdas/destinationTokenAccount';
import { getStructEncoder, getU8Encoder, type Encoder } from '@solana/codecs';

export interface ClaimTokenInstructionAccounts {
    payer: Address;
    wallet: Address;
    programAuthority: Address;
    programTokenAccount: Address;
    destinationTokenAccount?: Address;
    mint: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface ClaimTokenInstructionArgs {
    id: number;
}

function getClaimTokenInstructionDataEncoder(): Encoder<ClaimTokenInstructionArgs> {
    return getStructEncoder([['id', getU8Encoder()]]);
}

export async function createClaimTokenInstruction(
    accounts: ClaimTokenInstructionAccounts,
    args: ClaimTokenInstructionArgs,
    programId: Address = JUPITER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let destinationTokenAccount = accounts.destinationTokenAccount;
    if (!destinationTokenAccount) {
        const [derived] = await findDestinationTokenAccountPda(
            {
                wallet: accounts.wallet,
                tokenProgram: accounts.tokenProgram,
                mint: accounts.mint,
            },
            programId,
        );
        destinationTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.wallet, isSigner: false, isWritable: false },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.programTokenAccount, isSigner: false, isWritable: true },
        { pubkey: destinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getClaimTokenInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('74ce1bbfa6130049', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
