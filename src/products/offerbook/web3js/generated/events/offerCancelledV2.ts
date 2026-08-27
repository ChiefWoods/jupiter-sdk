import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getOfferEventV2Decoder, type OfferEventV2 } from '../types/offerEventV2';

export const OFFER_CANCELLED_V2_DISCRIMINATOR = new Uint8Array([39, 55, 186, 129, 177, 241, 117, 121]);

export function getOfferCancelledV2DiscriminatorBytes(): Uint8Array {
    return OFFER_CANCELLED_V2_DISCRIMINATOR;
}

export type OfferCancelledV2 = { offer: OfferEventV2; pubkey: Address };

function getOfferCancelledV2Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV2Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_CANCELLED_V2_DISCRIMINATOR)],
    );
}

export function parseOfferCancelledV2(data: Uint8Array): OfferCancelledV2 {
    if (!OFFER_CANCELLED_V2_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OfferCancelledV2 discriminator mismatch');
    }
    const decoded = getOfferCancelledV2Decoder().decode(data);
    return decoded as OfferCancelledV2;
}
