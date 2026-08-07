import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const FEE_DISCRIMINATOR = new Uint8Array([73, 79, 78, 127, 184, 213, 13, 220]);

export function getFeeEventDiscriminatorBytes(): Uint8Array {
    return FEE_DISCRIMINATOR;
}

export type Fee = { account: Address; mint: Address; amount: bigint };

function getFeeDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['account', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
        ]),
        [getConstantDecoder(FEE_DISCRIMINATOR)],
    );
}

export function parseFee(data: Uint8Array): Fee {
    if (!FEE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('FEE discriminator mismatch');
    }
    const decoded = getFeeDecoder().decode(data);
    return decoded as Fee;
}
