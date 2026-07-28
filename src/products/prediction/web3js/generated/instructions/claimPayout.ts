import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface ClaimPayoutInstructionAccounts {
    owner: Address;
    vault: Address;
    position: Address;
    marketResult: Address;
    ownerTokenAccount: Address;
    vaultTokenAccount: Address;
    tokenProgram: Address;
}

export function createClaimPayoutInstruction(
    accounts: ClaimPayoutInstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: false },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('7ff0843ee3c69285', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
