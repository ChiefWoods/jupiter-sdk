import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UNPAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR = new Uint8Array([229, 120, 123, 188, 146, 222, 159, 255]);

export function getLogUnpauseSwapAndArbitrageDiscriminatorBytes(): Uint8Array {
    return LOG_UNPAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR;
}

export type LogUnpauseSwapAndArbitrage = { dexId: number };

function getLogUnpauseSwapAndArbitrageDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['dexId', getU16Decoder()]]), [
        getConstantDecoder(LOG_UNPAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR),
    ]);
}

export function parseLogUnpauseSwapAndArbitrage(data: Uint8Array): LogUnpauseSwapAndArbitrage {
    if (!LOG_UNPAUSE_SWAP_AND_ARBITRAGE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUnpauseSwapAndArbitrage discriminator mismatch');
    }
    const decoded = getLogUnpauseSwapAndArbitrageDecoder().decode(data);
    return decoded as LogUnpauseSwapAndArbitrage;
}
