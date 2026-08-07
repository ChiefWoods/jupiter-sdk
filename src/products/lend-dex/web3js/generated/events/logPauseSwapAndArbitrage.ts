import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_PAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR = new Uint8Array([103, 184, 228, 52, 0, 229, 4, 154]);

export function getLogPauseSwapAndArbitrageDiscriminatorBytes(): Uint8Array {
    return LOG_PAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR;
}

export type LogPauseSwapAndArbitrage = { dexId: number };

function getLogPauseSwapAndArbitrageDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['dexId', getU16Decoder()]]), [
        getConstantDecoder(LOG_PAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR),
    ]);
}

export function parseLogPauseSwapAndArbitrage(data: Uint8Array): LogPauseSwapAndArbitrage {
    if (!LOG_PAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGPAUSESWAPANDARBITRAGE discriminator mismatch');
    }
    const decoded = getLogPauseSwapAndArbitrageDecoder().decode(data);
    return decoded as LogPauseSwapAndArbitrage;
}
