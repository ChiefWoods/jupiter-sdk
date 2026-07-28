import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface CreateTokenLedgerInstructionAccounts {
    tokenLedger: Address;
    payer: Address;
    systemProgram: Address;
}

export function createCreateTokenLedgerInstruction(
    accounts: CreateTokenLedgerInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenLedger, isSigner: true, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('e8f2c5fdf08f8134', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
