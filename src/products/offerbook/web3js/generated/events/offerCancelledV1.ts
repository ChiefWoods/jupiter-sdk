import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getOfferEventV1Decoder, type OfferEventV1 } from '../types/offerEventV1';

export const OFFER_CANCELLED_V1_DISCRIMINATOR = new Uint8Array([148, 210, 209, 158, 129, 50, 15, 166]);

export function getOfferCancelledV1DiscriminatorBytes(): Uint8Array {
    return OFFER_CANCELLED_V1_DISCRIMINATOR;
}

export type OfferCancelledV1 = { offer: OfferEventV1; pubkey: Address };

function getOfferCancelledV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_CANCELLED_V1_DISCRIMINATOR)],
    );
}

export function parseOfferCancelledV1(data: Uint8Array): OfferCancelledV1 {
    if (!OFFER_CANCELLED_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERCANCELLEDV1 discriminator mismatch');
    }
    const decoded = getOfferCancelledV1Decoder().decode(data);
    return decoded as OfferCancelledV1;
}
