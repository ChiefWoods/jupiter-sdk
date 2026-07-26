import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_PROGRAM_ID } from '..';

export interface ActivateProtocolInstructionAccounts {
    authority: Address;
    flashloanAdmin: Address;
}

export function createActivateProtocolInstruction(
    accounts: ActivateProtocolInstructionAccounts,
    programId: Address = FLASHLOAN_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.flashloanAdmin, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('e6ebbc13785b0b5e', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
