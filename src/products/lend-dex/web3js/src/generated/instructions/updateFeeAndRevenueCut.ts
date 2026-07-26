import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU32Codec } from '@solana/codecs';

export interface UpdateFeeAndRevenueCutInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateFeeAndRevenueCutInstructionArgs {
    fee: number;
    revenueCut: number;
}

const UpdateFeeAndRevenueCutInstructionDataCodec = getStructCodec([
    ['fee', getU32Codec()],
    ['revenueCut', getU32Codec()],
]);

export function createUpdateFeeAndRevenueCutInstruction(
    accounts: UpdateFeeAndRevenueCutInstructionAccounts,
    args: UpdateFeeAndRevenueCutInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateFeeAndRevenueCutInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('dffbb507223db77a', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
