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

export const INITIALIZE_DISCRIMINATOR = new Uint8Array([18, 233, 50, 5, 97, 190, 167, 209]);

export function getInitializeDiscriminatorBytes(): Uint8Array {
    return INITIALIZE_DISCRIMINATOR;
}

export type Initialize = { sender: Address; inviteSigner: Address; amount: bigint; expiration: bigint };

function getInitializeDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['inviteSigner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['expiration', getI64Decoder()],
        ]),
        [getConstantDecoder(INITIALIZE_DISCRIMINATOR)],
    );
}

export function parseInitialize(data: Uint8Array): Initialize {
    if (!INITIALIZE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('INITIALIZE discriminator mismatch');
    }
    const decoded = getInitializeDecoder().decode(data);
    return decoded as Initialize;
}
