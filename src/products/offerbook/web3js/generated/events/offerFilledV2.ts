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

export const OFFER_FILLED_V2_DISCRIMINATOR = new Uint8Array([140, 79, 66, 108, 81, 186, 66, 29]);

export function getOfferFilledV2DiscriminatorBytes(): Uint8Array {
    return OFFER_FILLED_V2_DISCRIMINATOR;
}

export type OfferFilledV2 = { offer: OfferEventV2; pubkey: Address };

function getOfferFilledV2Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['offer', getOfferEventV2Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(OFFER_FILLED_V2_DISCRIMINATOR)],
    );
}

export function parseOfferFilledV2(data: Uint8Array): OfferFilledV2 {
    if (!OFFER_FILLED_V2_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OfferFilledV2 discriminator mismatch');
    }
    const decoded = getOfferFilledV2Decoder().decode(data);
    return decoded as OfferFilledV2;
}
