import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UPDATE_UTILIZATION_LIMIT_DISCRIMINATOR = new Uint8Array([153, 239, 227, 172, 250, 247, 155, 69]);

export function getLogUpdateUtilizationLimitDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_UTILIZATION_LIMIT_DISCRIMINATOR;
}

export type LogUpdateUtilizationLimit = {
    dexId: number;
    token0UtilizationLimit: number;
    token1UtilizationLimit: number;
};

function getLogUpdateUtilizationLimitDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['token0UtilizationLimit', getU16Decoder()],
            ['token1UtilizationLimit', getU16Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_UTILIZATION_LIMIT_DISCRIMINATOR)],
    );
}

export function parseLogUpdateUtilizationLimit(data: Uint8Array): LogUpdateUtilizationLimit {
    if (!LOG_UPDATE_UTILIZATION_LIMIT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateUtilizationLimit discriminator mismatch');
    }
    const decoded = getLogUpdateUtilizationLimitDecoder().decode(data);
    return decoded as LogUpdateUtilizationLimit;
}
