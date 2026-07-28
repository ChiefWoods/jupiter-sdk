import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU32Encoder, type Encoder } from '@solana/codecs';

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

function getUpdateThresholdPercentInstructionDataEncoder(): Encoder<UpdateThresholdPercentInstructionArgs> {
    return getStructEncoder([
        ['upperThresholdPercent', getU32Encoder()],
        ['lowerThresholdPercent', getU32Encoder()],
        ['thresholdShiftTime', getU32Encoder()],
        ['shiftTime', getU32Encoder()],
    ]);
}

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
    const instructionData = Buffer.from(getUpdateThresholdPercentInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b17d63862afe8cea', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
