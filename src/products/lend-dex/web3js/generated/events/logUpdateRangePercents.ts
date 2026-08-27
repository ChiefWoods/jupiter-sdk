import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_RANGE_PERCENTS_DISCRIMINATOR = new Uint8Array([149, 47, 161, 6, 129, 240, 48, 100]);

export function getLogUpdateRangePercentsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_RANGE_PERCENTS_DISCRIMINATOR;
}

export type LogUpdateRangePercents = { dexId: number; upperPercent: number; lowerPercent: number; shiftTime: number };

function getLogUpdateRangePercentsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['upperPercent', getU32Decoder()],
            ['lowerPercent', getU32Decoder()],
            ['shiftTime', getU32Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_RANGE_PERCENTS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRangePercents(data: Uint8Array): LogUpdateRangePercents {
    if (!LOG_UPDATE_RANGE_PERCENTS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateRangePercents discriminator mismatch');
    }
    const decoded = getLogUpdateRangePercentsDecoder().decode(data);
    return decoded as LogUpdateRangePercents;
}
