import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU8Codec, transformCodec } from '@solana/codecs';

export interface AddressU8 {
    addr: Address;
    value: number;
}

export const addressU8Codec = getStructCodec([
    [
        'addr',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['value', getU8Codec()],
]);
