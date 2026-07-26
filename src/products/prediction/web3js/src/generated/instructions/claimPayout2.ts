import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface ClaimPayout2InstructionAccounts {
    authority: Address;
    vault: Address;
    position: Address;
    marketResult: Address;
    ownerTokenAccount: Address;
    vaultTokenAccount: Address;
    tokenProgram: Address;
}

export function createClaimPayout2Instruction(
    accounts: ClaimPayout2InstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: false },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('8dcd63cb8ee757e2', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
