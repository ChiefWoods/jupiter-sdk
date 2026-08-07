import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UPDATE_LIQUIDATION_MAX_LIMIT_DISCRIMINATOR = new Uint8Array([73, 32, 49, 0, 234, 86, 150, 94]);

export function getLogUpdateLiquidationMaxLimitDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_LIQUIDATION_MAX_LIMIT_DISCRIMINATOR;
}

export type LogUpdateLiquidationMaxLimit = { liquidationMaxLimit: number };

function getLogUpdateLiquidationMaxLimitDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['liquidationMaxLimit', getU16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_LIQUIDATION_MAX_LIMIT_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateLiquidationMaxLimit(data: Uint8Array): LogUpdateLiquidationMaxLimit {
    if (!LOG_UPDATE_LIQUIDATION_MAX_LIMIT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATELIQUIDATIONMAXLIMIT discriminator mismatch');
    }
    const decoded = getLogUpdateLiquidationMaxLimitDecoder().decode(data);
    return decoded as LogUpdateLiquidationMaxLimit;
}
