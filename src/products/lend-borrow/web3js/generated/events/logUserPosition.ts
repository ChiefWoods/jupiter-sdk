import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI32Decoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_USER_POSITION_DISCRIMINATOR = new Uint8Array([46, 44, 213, 42, 55, 59, 190, 133]);

export function getLogUserPositionDiscriminatorBytes(): Uint8Array {
    return LOG_USER_POSITION_DISCRIMINATOR;
}

export type LogUserPosition = {
    user: Address;
    nftId: number;
    vaultId: number;
    positionMint: Address;
    tick: number;
    col: bigint;
    borrow: bigint;
};

function getLogUserPositionDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['nftId', getU32Decoder()],
            ['vaultId', getU16Decoder()],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['tick', getI32Decoder()],
            ['col', getU64Decoder()],
            ['borrow', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_USER_POSITION_DISCRIMINATOR)],
    );
}

export function parseLogUserPosition(data: Uint8Array): LogUserPosition {
    if (!LOG_USER_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUserPosition discriminator mismatch');
    }
    const decoded = getLogUserPositionDecoder().decode(data);
    return decoded as LogUserPosition;
}
