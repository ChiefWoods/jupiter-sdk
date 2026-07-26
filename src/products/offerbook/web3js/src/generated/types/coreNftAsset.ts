import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface CoreNftAsset {
    asset: Address;
    reserved: Uint8Array;
}

export const coreNftAssetCodec = getStructCodec([
    [
        'asset',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved', fixCodecSize(getBytesCodec(), 232)],
]);
