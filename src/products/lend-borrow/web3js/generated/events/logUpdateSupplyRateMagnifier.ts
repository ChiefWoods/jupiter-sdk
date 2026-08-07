import { getConstantDecoder, getHiddenPrefixDecoder, getI16Decoder, getStructDecoder } from '@solana/codecs';

export const LOG_UPDATE_SUPPLY_RATE_MAGNIFIER_DISCRIMINATOR = new Uint8Array([198, 113, 184, 213, 239, 18, 253, 56]);

export function getLogUpdateSupplyRateMagnifierDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_SUPPLY_RATE_MAGNIFIER_DISCRIMINATOR;
}

export type LogUpdateSupplyRateMagnifier = { supplyRateMagnifier: number };

function getLogUpdateSupplyRateMagnifierDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['supplyRateMagnifier', getI16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_SUPPLY_RATE_MAGNIFIER_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateSupplyRateMagnifier(data: Uint8Array): LogUpdateSupplyRateMagnifier {
    if (!LOG_UPDATE_SUPPLY_RATE_MAGNIFIER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATESUPPLYRATEMAGNIFIER discriminator mismatch');
    }
    const decoded = getLogUpdateSupplyRateMagnifierDecoder().decode(data);
    return decoded as LogUpdateSupplyRateMagnifier;
}
