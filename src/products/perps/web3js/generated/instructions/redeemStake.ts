import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface RedeemStakeInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    stakeAccount: Address;
    stakeInfo: Address;
}

export function createRedeemStakeInstruction(
    accounts: RedeemStakeInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
    ];
    const data = Buffer.from('b2cbfa698576ff45', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
