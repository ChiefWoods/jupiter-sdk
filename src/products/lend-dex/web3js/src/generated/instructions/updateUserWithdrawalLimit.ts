import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface UpdateUserWithdrawalLimitInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserWithdrawalLimitInstructionArgs {
    newLimit: bigint;
}

const UpdateUserWithdrawalLimitInstructionDataCodec = getStructCodec([['newLimit', getU64Codec()]]);

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
    const instructionData = Buffer.from(UpdateUserWithdrawalLimitInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('a209ba09d51ead4e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
