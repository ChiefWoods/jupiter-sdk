import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UPDATE_LIQUIDATION_THRESHOLD_DISCRIMINATOR = new Uint8Array([211, 71, 215, 239, 159, 238, 71, 219]);

export function getLogUpdateLiquidationThresholdDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_LIQUIDATION_THRESHOLD_DISCRIMINATOR;
}

export type LogUpdateLiquidationThreshold = { liquidationThreshold: number };

function getLogUpdateLiquidationThresholdDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['liquidationThreshold', getU16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_LIQUIDATION_THRESHOLD_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateLiquidationThreshold(data: Uint8Array): LogUpdateLiquidationThreshold {
    if (!LOG_UPDATE_LIQUIDATION_THRESHOLD_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateLiquidationThreshold discriminator mismatch');
    }
    const decoded = getLogUpdateLiquidationThresholdDecoder().decode(data);
    return decoded as LogUpdateLiquidationThreshold;
}
