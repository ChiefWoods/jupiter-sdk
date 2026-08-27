import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_THRESHOLD_PERCENT_DISCRIMINATOR = new Uint8Array([44, 46, 70, 115, 25, 38, 92, 99]);

export function getLogUpdateThresholdPercentDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_THRESHOLD_PERCENT_DISCRIMINATOR;
}

export type LogUpdateThresholdPercent = {
    dexId: number;
    upperThresholdPercent: number;
    lowerThresholdPercent: number;
    thresholdShiftTime: number;
    shiftTime: number;
};

function getLogUpdateThresholdPercentDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['upperThresholdPercent', getU32Decoder()],
            ['lowerThresholdPercent', getU32Decoder()],
            ['thresholdShiftTime', getU32Decoder()],
            ['shiftTime', getU32Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_THRESHOLD_PERCENT_DISCRIMINATOR)],
    );
}

export function parseLogUpdateThresholdPercent(data: Uint8Array): LogUpdateThresholdPercent {
    if (!LOG_UPDATE_THRESHOLD_PERCENT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateThresholdPercent discriminator mismatch');
    }
    const decoded = getLogUpdateThresholdPercentDecoder().decode(data);
    return decoded as LogUpdateThresholdPercent;
}
