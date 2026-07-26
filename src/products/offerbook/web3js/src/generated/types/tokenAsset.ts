import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface TokenAsset {
    mint: Address;
    tokenProgram: Address;
    reserved: Uint8Array;
}

export const tokenAssetCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'tokenProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved', fixCodecSize(getBytesCodec(), 200)],
]);
