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

export const OFFER_CREATED_DISCRIMINATOR = new Uint8Array([31, 236, 215, 144, 75, 45, 157, 87]);

export function getOfferCreatedDiscriminatorBytes(): Uint8Array {
    return OFFER_CREATED_DISCRIMINATOR;
}

export type OfferCreated = { offer: OfferEventV0; pubkey: Address };

function getOfferCreatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV0Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_CREATED_DISCRIMINATOR)],
    );
}

export function parseOfferCreated(data: Uint8Array): OfferCreated {
    if (!OFFER_CREATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERCREATED discriminator mismatch');
    }
    const decoded = getOfferCreatedDecoder().decode(data);
    return decoded as OfferCreated;
}
