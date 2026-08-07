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

export const OFFER_CREATED_V1_DISCRIMINATOR = new Uint8Array([113, 118, 59, 240, 159, 129, 104, 196]);

export function getOfferCreatedV1DiscriminatorBytes(): Uint8Array {
    return OFFER_CREATED_V1_DISCRIMINATOR;
}

export type OfferCreatedV1 = { offer: OfferEventV1; pubkey: Address };

function getOfferCreatedV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_CREATED_V1_DISCRIMINATOR)],
    );
}

export function parseOfferCreatedV1(data: Uint8Array): OfferCreatedV1 {
    if (!OFFER_CREATED_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERCREATEDV1 discriminator mismatch');
    }
    const decoded = getOfferCreatedV1Decoder().decode(data);
    return decoded as OfferCreatedV1;
}
