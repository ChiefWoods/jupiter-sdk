import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';

export interface PauseProtocolInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export function createPauseProtocolInstruction(
    accounts: PauseProtocolInstructionAccounts,
    programId: Address = FLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('905f006b7727f88d', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
