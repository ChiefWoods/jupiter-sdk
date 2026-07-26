import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';

export interface ClosePositionInstructionAccounts {
    authority: Address;
    owner: Address;
    position: Address;
    rentDestination: Address;
}

export function createClosePositionInstruction(
    accounts: ClosePositionInstructionAccounts,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.rentDestination, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('7b86510031446262', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
