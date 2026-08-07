import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UNPAUSE_DEX_DISCRIMINATOR = new Uint8Array([6, 190, 255, 207, 165, 71, 170, 212]);

export function getLogUnpauseDexDiscriminatorBytes(): Uint8Array {
    return LOG_UNPAUSE_DEX_DISCRIMINATOR;
}

export type LogUnpauseDex = { dexId: number };

function getLogUnpauseDexDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['dexId', getU16Decoder()]]), [
        getConstantDecoder(LOG_UNPAUSE_DEX_DISCRIMINATOR),
    ]);
}

export function parseLogUnpauseDex(data: Uint8Array): LogUnpauseDex {
    if (!LOG_UNPAUSE_DEX_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUNPAUSEDEX discriminator mismatch');
    }
    const decoded = getLogUnpauseDexDecoder().decode(data);
    return decoded as LogUnpauseDex;
}
