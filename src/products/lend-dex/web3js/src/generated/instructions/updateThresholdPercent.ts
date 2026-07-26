import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU32Codec } from '@solana/codecs';

export interface UpdateThresholdPercentInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateThresholdPercentInstructionArgs {
    upperThresholdPercent: number;
    lowerThresholdPercent: number;
    thresholdShiftTime: number;
    shiftTime: number;
}

const UpdateThresholdPercentInstructionDataCodec = getStructCodec([
    ['upperThresholdPercent', getU32Codec()],
    ['lowerThresholdPercent', getU32Codec()],
    ['thresholdShiftTime', getU32Codec()],
    ['shiftTime', getU32Codec()],
]);

export function createUpdateThresholdPercentInstruction(
    accounts: UpdateThresholdPercentInstructionAccounts,
    args: UpdateThresholdPercentInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateThresholdPercentInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b17d63862afe8cea', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
