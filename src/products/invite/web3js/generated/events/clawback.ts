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

export const CLAWBACK_DISCRIMINATOR = new Uint8Array([239, 144, 30, 69, 80, 59, 142, 64]);

export function getClawbackDiscriminatorBytes(): Uint8Array {
    return CLAWBACK_DISCRIMINATOR;
}

export type Clawback = { sender: Address; amount: bigint };

function getClawbackDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
        ]),
        [getConstantDecoder(CLAWBACK_DISCRIMINATOR)],
    );
}

export function parseClawback(data: Uint8Array): Clawback {
    if (!CLAWBACK_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CLAWBACK discriminator mismatch');
    }
    const decoded = getClawbackDecoder().decode(data);
    return decoded as Clawback;
}
