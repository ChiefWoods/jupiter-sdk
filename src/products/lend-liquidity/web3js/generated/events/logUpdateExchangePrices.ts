import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU128Decoder,
    getU16Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_EXCHANGE_PRICES_DISCRIMINATOR = new Uint8Array([190, 194, 69, 204, 30, 86, 181, 163]);

export function getLogUpdateExchangePricesDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_EXCHANGE_PRICES_DISCRIMINATOR;
}

export type LogUpdateExchangePrices = {
    token: Address;
    supplyExchangePrice: bigint;
    borrowExchangePrice: bigint;
    borrowRate: number;
    utilization: number;
};

function getLogUpdateExchangePricesDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['supplyExchangePrice', getU128Decoder()],
            ['borrowExchangePrice', getU128Decoder()],
            ['borrowRate', getU16Decoder()],
            ['utilization', getU16Decoder()],
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
