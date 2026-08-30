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

export const INITIALIZE_TOKEN_DISCRIMINATOR = new Uint8Array([174, 83, 149, 139, 185, 225, 137, 128]);

export function getInitializeTokenDiscriminatorBytes(): Uint8Array {
    return INITIALIZE_TOKEN_DISCRIMINATOR;
}

export type InitializeToken = {
    sender: Address;
    inviteSigner: Address;
    amount: bigint;
    expiration: bigint;
    mint: Address;
};

function getInitializeTokenDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['inviteSigner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['expiration', getI64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(INITIALIZE_TOKEN_DISCRIMINATOR)],
    );
}

export function parseInitializeToken(data: Uint8Array): InitializeToken {
    if (!INITIALIZE_TOKEN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InitializeToken discriminator mismatch');
    }
    const decoded = getInitializeTokenDecoder().decode(data);
    return decoded as InitializeToken;
}
