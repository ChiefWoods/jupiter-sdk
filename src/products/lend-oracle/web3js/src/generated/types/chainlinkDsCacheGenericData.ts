import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU128Codec,
    getU32Codec,
    getU64Codec,
} from '@solana/codecs';

export interface ChainlinkDsCacheGenericData {
    xstocksActivationDateTime: bigint;
    xstocksSuspended: boolean;
    marketStatus: number;
    v11TransitionTimestampS: bigint;
    xstocksLastMultiplier: bigint;
    xstocksLastObservationsTimestampMultiplierS: bigint;
    padding: Uint8Array;
}

export const chainlinkDsCacheGenericDataCodec = getStructCodec([
    ['xstocksActivationDateTime', getU64Codec()],
    ['xstocksSuspended', getBooleanCodec()],
    ['marketStatus', getU32Codec()],
    ['v11TransitionTimestampS', getU64Codec()],
    ['xstocksLastMultiplier', getU128Codec()],
    ['xstocksLastObservationsTimestampMultiplierS', getU64Codec()],
    ['padding', fixCodecSize(getBytesCodec(), 24)],
]);
