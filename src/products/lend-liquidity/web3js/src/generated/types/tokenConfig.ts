import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU128Codec, transformCodec } from '@solana/codecs';

export interface TokenConfig {
    token: Address;
    fee: bigint;
    maxUtilization: bigint;
}

export const tokenConfigCodec = getStructCodec([
    [
        'token',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['fee', getU128Codec()],
    ['maxUtilization', getU128Codec()],
]);
