import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface FirstVerifiedCreatorFilter {
    creator: Address;
    reserved: Uint8Array;
}

export const firstVerifiedCreatorFilterCodec = getStructCodec([
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved', fixCodecSize(getBytesCodec(), 232)],
]);
