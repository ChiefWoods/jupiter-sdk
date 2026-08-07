import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const LOG_REBALANCE_DISCRIMINATOR = new Uint8Array([90, 67, 219, 41, 181, 118, 132, 9]);

export function getLogRebalanceDiscriminatorBytes(): Uint8Array {
    return LOG_REBALANCE_DISCRIMINATOR;
}

export type LogRebalance = { assets: bigint };

function getLogRebalanceDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['assets', getU64Decoder()]]), [
        getConstantDecoder(LOG_REBALANCE_DISCRIMINATOR),
    ]);
}

export function parseLogRebalance(data: Uint8Array): LogRebalance {
    if (!LOG_REBALANCE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGREBALANCE discriminator mismatch');
    }
    const decoded = getLogRebalanceDecoder().decode(data);
    return decoded as LogRebalance;
}
