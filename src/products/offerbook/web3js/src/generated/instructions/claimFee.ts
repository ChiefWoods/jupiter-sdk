import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';

export interface ClaimFeeInstructionAccounts {
    admin: Address;
    config: Address;
    feeAuthority: Address;
    mint: Address;
    protocolFeeTokenAccount: Address;
    destTokenAccount: Address;
    tokenProgram: Address;
}

export function createClaimFeeInstruction(
    accounts: ClaimFeeInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.feeAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.destTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('a9204f8988e84689', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
