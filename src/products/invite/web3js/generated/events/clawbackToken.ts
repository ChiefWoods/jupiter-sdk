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

export const CLAWBACK_TOKEN_DISCRIMINATOR = new Uint8Array([87, 168, 194, 153, 93, 74, 101, 240]);

export function getClawbackTokenDiscriminatorBytes(): Uint8Array {
    return CLAWBACK_TOKEN_DISCRIMINATOR;
}

export type ClawbackToken = { sender: Address; amount: bigint; mint: Address };

function getClawbackTokenDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CLAWBACK_TOKEN_DISCRIMINATOR)],
    );
}

export function parseClawbackToken(data: Uint8Array): ClawbackToken {
    if (!CLAWBACK_TOKEN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ClawbackToken discriminator mismatch');
    }
    const decoded = getClawbackTokenDecoder().decode(data);
    return decoded as ClawbackToken;
}
