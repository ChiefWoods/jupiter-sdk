import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const EXPIRE_TOKEN_DISCRIMINATOR = new Uint8Array([218, 185, 151, 32, 227, 207, 182, 98]);

export function getExpireTokenDiscriminatorBytes(): Uint8Array {
    return EXPIRE_TOKEN_DISCRIMINATOR;
}

export type ExpireToken = { sender: Address; amount: bigint; mint: Address; expiration: bigint };

function getExpireTokenDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['expiration', getI64Decoder()],
        ]),
        [getConstantDecoder(EXPIRE_TOKEN_DISCRIMINATOR)],
    );
}

export function parseExpireToken(data: Uint8Array): ExpireToken {
    if (!EXPIRE_TOKEN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ExpireToken discriminator mismatch');
    }
    const decoded = getExpireTokenDecoder().decode(data);
    return decoded as ExpireToken;
}
