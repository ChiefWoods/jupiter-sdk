import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getOfferEventV0Decoder, type OfferEventV0 } from '../types/offerEventV0';

export const OFFER_FILLED_DISCRIMINATOR = new Uint8Array([173, 104, 95, 161, 144, 206, 72, 57]);

export function getOfferFilledDiscriminatorBytes(): Uint8Array {
    return OFFER_FILLED_DISCRIMINATOR;
}

export type OfferFilled = { offer: OfferEventV0; pubkey: Address };

function getOfferFilledDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV0Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_FILLED_DISCRIMINATOR)],
    );
}

export function parseOfferFilled(data: Uint8Array): OfferFilled {
    if (!OFFER_FILLED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERFILLED discriminator mismatch');
    }
    const decoded = getOfferFilledDecoder().decode(data);
    return decoded as OfferFilled;
}
