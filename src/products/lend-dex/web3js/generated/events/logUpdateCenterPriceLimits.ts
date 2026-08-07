import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_CENTER_PRICE_LIMITS_DISCRIMINATOR = new Uint8Array([111, 228, 61, 31, 234, 76, 5, 17]);

export function getLogUpdateCenterPriceLimitsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_CENTER_PRICE_LIMITS_DISCRIMINATOR;
}

export type LogUpdateCenterPriceLimits = { dexId: number; maxCenterPrice: bigint; minCenterPrice: bigint };

function getLogUpdateCenterPriceLimitsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['maxCenterPrice', getU64Decoder()],
            ['minCenterPrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_CENTER_PRICE_LIMITS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateCenterPriceLimits(data: Uint8Array): LogUpdateCenterPriceLimits {
    if (!LOG_UPDATE_CENTER_PRICE_LIMITS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATECENTERPRICELIMITS discriminator mismatch');
    }
    const decoded = getLogUpdateCenterPriceLimitsDecoder().decode(data);
    return decoded as LogUpdateCenterPriceLimits;
}
