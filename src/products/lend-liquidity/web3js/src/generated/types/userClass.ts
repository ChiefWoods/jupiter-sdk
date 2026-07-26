import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU8Codec, transformCodec } from '@solana/codecs';

export interface UserClass {
    addr: Address;
    class: number;
}

export const userClassCodec = getStructCodec([
    [
        'addr',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['class', getU8Codec()],
]);
