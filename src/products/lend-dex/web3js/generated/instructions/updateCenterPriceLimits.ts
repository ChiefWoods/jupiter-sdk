import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface UpdateCenterPriceLimitsInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateCenterPriceLimitsInstructionArgs {
    maxCenterPrice: number | bigint;
    minCenterPrice: number | bigint;
}

function getUpdateCenterPriceLimitsInstructionDataEncoder(): Encoder<UpdateCenterPriceLimitsInstructionArgs> {
    return getStructEncoder([
        ['maxCenterPrice', getU64Encoder()],
        ['minCenterPrice', getU64Encoder()],
    ]);
}

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
    const instructionData = Buffer.from(getUpdateCenterPriceLimitsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('111738c8eda31898', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
