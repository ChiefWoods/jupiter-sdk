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

export const OFFER_CREATED_V2_DISCRIMINATOR = new Uint8Array([107, 228, 58, 148, 11, 235, 232, 181]);

export function getOfferCreatedV2DiscriminatorBytes(): Uint8Array {
    return OFFER_CREATED_V2_DISCRIMINATOR;
}

export type OfferCreatedV2 = { offer: OfferEventV2; pubkey: Address };

function getOfferCreatedV2Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV2Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_CREATED_V2_DISCRIMINATOR)],
    );
}

export function parseOfferCreatedV2(data: Uint8Array): OfferCreatedV2 {
    if (!OFFER_CREATED_V2_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OFFERCREATEDV2 discriminator mismatch');
    }
    const decoded = getOfferCreatedV2Decoder().decode(data);
    return decoded as OfferCreatedV2;
}
