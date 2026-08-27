import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_CENTER_PRICE_ADDRESS_DISCRIMINATOR = new Uint8Array([96, 24, 207, 2, 38, 203, 43, 145]);

export function getLogUpdateCenterPriceAddressDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_CENTER_PRICE_ADDRESS_DISCRIMINATOR;
}

export type LogUpdateCenterPriceAddress = { dexId: number; centerPriceAddress: Address; percent: number; time: number };

function getLogUpdateCenterPriceAddressDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            [
                'centerPriceAddress',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['percent', getU32Decoder()],
            ['time', getU32Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_CENTER_PRICE_ADDRESS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateCenterPriceAddress(data: Uint8Array): LogUpdateCenterPriceAddress {
    if (!LOG_UPDATE_CENTER_PRICE_ADDRESS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateCenterPriceAddress discriminator mismatch');
    }
    const decoded = getLogUpdateCenterPriceAddressDecoder().decode(data);
    return decoded as LogUpdateCenterPriceAddress;
}
