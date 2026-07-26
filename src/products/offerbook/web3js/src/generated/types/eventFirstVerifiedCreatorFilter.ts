import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface EventFirstVerifiedCreatorFilter {
    creator: Address;
}

export const eventFirstVerifiedCreatorFilterCodec = getStructCodec([
    [
        'creator',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);
