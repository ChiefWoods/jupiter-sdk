import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface UpdateUserWithdrawalLimitInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserWithdrawalLimitInstructionArgs {
    newLimit: number | bigint;
}

function getUpdateUserWithdrawalLimitInstructionDataEncoder(): Encoder<UpdateUserWithdrawalLimitInstructionArgs> {
    return getStructEncoder([['newLimit', getU64Encoder()]]);
}

export function createUpdateUserWithdrawalLimitInstruction(
    accounts: UpdateUserWithdrawalLimitInstructionAccounts,
    args: UpdateUserWithdrawalLimitInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateUserWithdrawalLimitInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a209ba09d51ead4e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
