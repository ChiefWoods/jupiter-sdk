import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface EventCollectionWithAttributeFilter {
    collection: Address;
    attributes: Uint8Array;
}

export const eventCollectionWithAttributeFilterCodec = getStructCodec([
    [
        'collection',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['attributes', fixCodecSize(getBytesCodec(), 232)],
]);
