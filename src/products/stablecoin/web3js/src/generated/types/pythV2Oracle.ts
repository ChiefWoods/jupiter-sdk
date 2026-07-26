import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface PythV2Oracle {
    feedId: Uint8Array;
    account: Address;
    reserved1: Uint8Array;
    reserved2: Uint8Array;
}

export const pythV2OracleCodec = getStructCodec([
    ['feedId', fixCodecSize(getBytesCodec(), 32)],
    [
        'account',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved1', fixCodecSize(getBytesCodec(), 32)],
    ['reserved2', fixCodecSize(getBytesCodec(), 24)],
]);
