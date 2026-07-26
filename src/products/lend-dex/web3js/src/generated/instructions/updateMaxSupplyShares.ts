import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface UpdateMaxSupplySharesInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateMaxSupplySharesInstructionArgs {
    maxSupplyShares: bigint;
}

const UpdateMaxSupplySharesInstructionDataCodec = getStructCodec([['maxSupplyShares', getU64Codec()]]);

export function createUpdateMaxSupplySharesInstruction(
    accounts: UpdateMaxSupplySharesInstructionAccounts,
    args: UpdateMaxSupplySharesInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateMaxSupplySharesInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b39d25ceb033254f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
