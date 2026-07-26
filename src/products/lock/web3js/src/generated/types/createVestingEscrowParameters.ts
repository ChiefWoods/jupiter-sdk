import { getStructCodec, getU64Codec, getU8Codec } from '@solana/codecs';

export interface CreateVestingEscrowParameters {
    vestingStartTime: bigint;
    cliffTime: bigint;
    frequency: bigint;
    cliffUnlockAmount: bigint;
    amountPerPeriod: bigint;
    numberOfPeriod: bigint;
    updateRecipientMode: number;
    cancelMode: number;
}

export const createVestingEscrowParametersCodec = getStructCodec([
    ['vestingStartTime', getU64Codec()],
    ['cliffTime', getU64Codec()],
    ['frequency', getU64Codec()],
    ['cliffUnlockAmount', getU64Codec()],
    ['amountPerPeriod', getU64Codec()],
    ['numberOfPeriod', getU64Codec()],
    ['updateRecipientMode', getU8Codec()],
    ['cancelMode', getU8Codec()],
]);
