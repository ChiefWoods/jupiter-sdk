import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface UpdateCenterPriceLimitsInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateCenterPriceLimitsInstructionArgs {
    maxCenterPrice: bigint;
    minCenterPrice: bigint;
}

const UpdateCenterPriceLimitsInstructionDataCodec = getStructCodec([
    ['maxCenterPrice', getU64Codec()],
    ['minCenterPrice', getU64Codec()],
]);

export function createUpdateCenterPriceLimitsInstruction(
    accounts: UpdateCenterPriceLimitsInstructionAccounts,
    args: UpdateCenterPriceLimitsInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateCenterPriceLimitsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('111738c8eda31898', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
