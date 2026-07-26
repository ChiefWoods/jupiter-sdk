import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface CollectionWithAttributeFilter {
    collection: Address;
    attributes: Uint8Array;
}

export const collectionWithAttributeFilterCodec = getStructCodec([
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
