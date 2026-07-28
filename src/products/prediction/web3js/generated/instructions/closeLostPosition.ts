import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface CloseLostPositionInstructionAccounts {
    authority: Address;
    vault: Address;
    position: Address;
    marketResult: Address;
}

export function createCloseLostPositionInstruction(
    accounts: CloseLostPositionInstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.marketResult, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('eb9dbf82e3d668b2', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
