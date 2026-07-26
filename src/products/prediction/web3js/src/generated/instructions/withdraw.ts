import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PREDICTIONMARKET_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface WithdrawInstructionAccounts {
    admin: Address;
    vault: Address;
    destinationTokenAccount: Address;
    vaultTokenAccount: Address;
    tokenProgram: Address;
}

export interface WithdrawInstructionArgs {
    amount: bigint;
}

const WithdrawInstructionDataCodec = getStructCodec([['amount', getU64Codec()]]);

export function createWithdrawInstruction(
    accounts: WithdrawInstructionAccounts,
    args: WithdrawInstructionArgs,
    programId: Address = PREDICTIONMARKET_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: false },
        { pubkey: accounts.destinationTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(WithdrawInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b712469c946da122', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
