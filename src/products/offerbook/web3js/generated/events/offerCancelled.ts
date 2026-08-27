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

export const OFFER_CANCELLED_DISCRIMINATOR = new Uint8Array([45, 42, 175, 214, 51, 192, 154, 9]);

export function getOfferCancelledDiscriminatorBytes(): Uint8Array {
    return OFFER_CANCELLED_DISCRIMINATOR;
}

export type OfferCancelled = { offer: OfferEventV0; pubkey: Address };

function getOfferCancelledDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV0Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_CANCELLED_DISCRIMINATOR)],
    );
}

export function parseOfferCancelled(data: Uint8Array): OfferCancelled {
    if (!OFFER_CANCELLED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OfferCancelled discriminator mismatch');
    }
    const decoded = getOfferCancelledDecoder().decode(data);
    return decoded as OfferCancelled;
}
