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

export const OFFER_FILLED_V1_DISCRIMINATOR = new Uint8Array([53, 129, 248, 144, 138, 91, 209, 155]);

export function getOfferFilledV1DiscriminatorBytes(): Uint8Array {
    return OFFER_FILLED_V1_DISCRIMINATOR;
}

export type OfferFilledV1 = { offer: OfferEventV1; pubkey: Address };

function getOfferFilledV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_FILLED_V1_DISCRIMINATOR)],
    );
}

export function parseOfferFilledV1(data: Uint8Array): OfferFilledV1 {
    if (!OFFER_FILLED_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERFILLEDV1 discriminator mismatch');
    }
    const decoded = getOfferFilledV1Decoder().decode(data);
    return decoded as OfferFilledV1;
}
