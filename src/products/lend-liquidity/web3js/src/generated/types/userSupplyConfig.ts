import { getStructCodec, getU128Codec, getU8Codec } from '@solana/codecs';

export interface UserSupplyConfig {
    mode: number;
    expandPercent: bigint;
    expandDuration: bigint;
    baseWithdrawalLimit: bigint;
}

export const userSupplyConfigCodec = getStructCodec([
    ['mode', getU8Codec()],
    ['expandPercent', getU128Codec()],
    ['expandDuration', getU128Codec()],
    ['baseWithdrawalLimit', getU128Codec()],
]);
