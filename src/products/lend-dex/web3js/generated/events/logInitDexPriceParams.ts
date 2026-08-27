import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_INIT_DEX_PRICE_PARAMS_DISCRIMINATOR = new Uint8Array([154, 98, 101, 72, 8, 203, 37, 200]);

export function getLogInitDexPriceParamsDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_DEX_PRICE_PARAMS_DISCRIMINATOR;
}

export type LogInitDexPriceParams = {
    dexId: number;
    upperPercent: number;
    lowerPercent: number;
    upperShiftThreshold: number;
    lowerShiftThreshold: number;
    thresholdShiftTime: number;
    maxCenterPrice: bigint;
    minCenterPrice: bigint;
};

function getLogInitDexPriceParamsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['upperPercent', getU32Decoder()],
            ['lowerPercent', getU32Decoder()],
            ['upperShiftThreshold', getU32Decoder()],
            ['lowerShiftThreshold', getU32Decoder()],
            ['thresholdShiftTime', getU32Decoder()],
            ['maxCenterPrice', getU64Decoder()],
            ['minCenterPrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_INIT_DEX_PRICE_PARAMS_DISCRIMINATOR)],
    );
}

export function parseLogInitDexPriceParams(data: Uint8Array): LogInitDexPriceParams {
    if (!LOG_INIT_DEX_PRICE_PARAMS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogInitDexPriceParams discriminator mismatch');
    }
    const decoded = getLogInitDexPriceParamsDecoder().decode(data);
    return decoded as LogInitDexPriceParams;
}
