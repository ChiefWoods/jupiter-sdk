import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, transformCodec } from '@solana/codecs';

export interface FeeOverride {
    mint: Address;
    mintFeeRate: number;
    redeemFeeRate: number;
    padding: Uint8Array;
}

export const feeOverrideCodec = getStructCodec([
    [
        'mint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['mintFeeRate', getU16Codec()],
    ['redeemFeeRate', getU16Codec()],
    ['padding', fixCodecSize(getBytesCodec(), 4)],
]);
