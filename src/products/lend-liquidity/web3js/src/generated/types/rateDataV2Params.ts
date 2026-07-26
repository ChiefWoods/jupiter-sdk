import { getStructCodec, getU128Codec } from '@solana/codecs';

export interface RateDataV2Params {
    kink1: bigint;
    kink2: bigint;
    rateAtUtilizationZero: bigint;
    rateAtUtilizationKink1: bigint;
    rateAtUtilizationKink2: bigint;
    rateAtUtilizationMax: bigint;
}

export const rateDataV2ParamsCodec = getStructCodec([
    ['kink1', getU128Codec()],
    ['kink2', getU128Codec()],
    ['rateAtUtilizationZero', getU128Codec()],
    ['rateAtUtilizationKink1', getU128Codec()],
    ['rateAtUtilizationKink2', getU128Codec()],
    ['rateAtUtilizationMax', getU128Codec()],
]);
