import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI128Decoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_ARBITRAGE_DISCRIMINATOR = new Uint8Array([105, 165, 52, 9, 218, 211, 46, 13]);

export function getLogArbitrageDiscriminatorBytes(): Uint8Array {
    return LOG_ARBITRAGE_DISCRIMINATOR;
}

export type LogArbitrage = { dexId: number; routing: bigint; amtOut: bigint };

function getLogArbitrageDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['routing', getI128Decoder()],
            ['amtOut', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_ARBITRAGE_DISCRIMINATOR)],
    );
}

export function parseLogArbitrage(data: Uint8Array): LogArbitrage {
    if (!LOG_ARBITRAGE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGARBITRAGE discriminator mismatch');
    }
    const decoded = getLogArbitrageDecoder().decode(data);
    return decoded as LogArbitrage;
}
