import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_PAUSE_DEX_DISCRIMINATOR = new Uint8Array([107, 202, 204, 255, 100, 73, 92, 117]);

export function getLogPauseDexDiscriminatorBytes(): Uint8Array {
    return LOG_PAUSE_DEX_DISCRIMINATOR;
}

export type LogPauseDex = { dexId: number };

function getLogPauseDexDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['dexId', getU16Decoder()]]), [
        getConstantDecoder(LOG_PAUSE_DEX_DISCRIMINATOR),
    ]);
}

export function parseLogPauseDex(data: Uint8Array): LogPauseDex {
    if (!LOG_PAUSE_DEX_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogPauseDex discriminator mismatch');
    }
    const decoded = getLogPauseDexDecoder().decode(data);
    return decoded as LogPauseDex;
}
