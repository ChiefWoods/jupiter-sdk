import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const LOG_UPDATE_RATES_DISCRIMINATOR = new Uint8Array([222, 11, 113, 60, 147, 15, 68, 217]);

export function getLogUpdateRatesDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_RATES_DISCRIMINATOR;
}

export type LogUpdateRates = { tokenExchangePrice: bigint; liquidityExchangePrice: bigint };

function getLogUpdateRatesDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['tokenExchangePrice', getU64Decoder()],
            ['liquidityExchangePrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_RATES_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRates(data: Uint8Array): LogUpdateRates {
    if (!LOG_UPDATE_RATES_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateRates discriminator mismatch');
    }
    const decoded = getLogUpdateRatesDecoder().decode(data);
    return decoded as LogUpdateRates;
}
