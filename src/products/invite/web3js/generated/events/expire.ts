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

export const EXPIRE_DISCRIMINATOR = new Uint8Array([234, 255, 38, 74, 163, 225, 3, 148]);

export function getExpireDiscriminatorBytes(): Uint8Array {
    return EXPIRE_DISCRIMINATOR;
}

export type Expire = { sender: Address; amount: bigint; expiration: bigint };

function getExpireDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['expiration', getI64Decoder()],
        ]),
        [getConstantDecoder(EXPIRE_DISCRIMINATOR)],
    );
}

export function parseExpire(data: Uint8Array): Expire {
    if (!EXPIRE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EXPIRE discriminator mismatch');
    }
    const decoded = getExpireDecoder().decode(data);
    return decoded as Expire;
}
