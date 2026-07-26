import { getStructCodec, getU128Codec } from '@solana/codecs';

export interface RateDataV1Params {
    kink: bigint;
    rateAtUtilizationZero: bigint;
    rateAtUtilizationKink: bigint;
    rateAtUtilizationMax: bigint;
}

export const rateDataV1ParamsCodec = getStructCodec([
    ['kink', getU128Codec()],
    ['rateAtUtilizationZero', getU128Codec()],
    ['rateAtUtilizationKink', getU128Codec()],
    ['rateAtUtilizationMax', getU128Codec()],
]);
