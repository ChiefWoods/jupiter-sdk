import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface DovesOracle {
    account: Address;
    reserved1: Uint8Array;
    reserved2: Uint8Array;
    reserved3: Uint8Array;
}

export const dovesOracleCodec = getStructCodec([
    [
        'account',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved1', fixCodecSize(getBytesCodec(), 32)],
    ['reserved2', fixCodecSize(getBytesCodec(), 32)],
    ['reserved3', fixCodecSize(getBytesCodec(), 24)],
]);
