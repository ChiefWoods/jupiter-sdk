import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface UpdateMaxBorrowSharesInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateMaxBorrowSharesInstructionArgs {
    maxBorrowShares: bigint;
}

const UpdateMaxBorrowSharesInstructionDataCodec = getStructCodec([['maxBorrowShares', getU64Codec()]]);

export function createUpdateMaxBorrowSharesInstruction(
    accounts: UpdateMaxBorrowSharesInstructionAccounts,
    args: UpdateMaxBorrowSharesInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateMaxBorrowSharesInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b00d79bde1e1ee4e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
