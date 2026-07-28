import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';

export interface RefreshAssetsUnderManagementInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    lpTokenMint: Address;
}

export function createRefreshAssetsUnderManagementInstruction(
    accounts: RefreshAssetsUnderManagementInstructionAccounts,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('a200d737e10fb900', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
