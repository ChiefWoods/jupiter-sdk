import { Address } from '@solana/web3.js';
import { fixCodecSize, getBooleanCodec, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface AddressBool {
    addr: Address;
    value: boolean;
}

export const addressBoolCodec = getStructCodec([
    [
        'addr',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['value', getBooleanCodec()],
]);
