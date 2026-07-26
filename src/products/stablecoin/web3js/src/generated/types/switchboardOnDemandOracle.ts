import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface SwitchboardOnDemandOracle {
    account: Address;
    reserved: Uint8Array;
    reserved1: Uint8Array;
    reserved2: Uint8Array;
}

export const switchboardOnDemandOracleCodec = getStructCodec([
    [
        'account',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['reserved', fixCodecSize(getBytesCodec(), 32)],
    ['reserved1', fixCodecSize(getBytesCodec(), 32)],
    ['reserved2', fixCodecSize(getBytesCodec(), 24)],
]);
