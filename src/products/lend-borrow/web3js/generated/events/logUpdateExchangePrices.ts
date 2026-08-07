import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const LOG_UPDATE_EXCHANGE_PRICES_DISCRIMINATOR = new Uint8Array([190, 194, 69, 204, 30, 86, 181, 163]);

export function getLogUpdateExchangePricesDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_EXCHANGE_PRICES_DISCRIMINATOR;
}

export type LogUpdateExchangePrices = {
    vaultSupplyExchangePrice: bigint;
    vaultBorrowExchangePrice: bigint;
    liquiditySupplyExchangePrice: bigint;
    liquidityBorrowExchangePrice: bigint;
};

function getLogUpdateExchangePricesDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vaultSupplyExchangePrice', getU64Decoder()],
            ['vaultBorrowExchangePrice', getU64Decoder()],
            ['liquiditySupplyExchangePrice', getU64Decoder()],
            ['liquidityBorrowExchangePrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_EXCHANGE_PRICES_DISCRIMINATOR)],
    );
}

export function parseLogUpdateExchangePrices(data: Uint8Array): LogUpdateExchangePrices {
    if (!LOG_UPDATE_EXCHANGE_PRICES_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEEXCHANGEPRICES discriminator mismatch');
    }
    const decoded = getLogUpdateExchangePricesDecoder().decode(data);
    return decoded as LogUpdateExchangePrices;
}
