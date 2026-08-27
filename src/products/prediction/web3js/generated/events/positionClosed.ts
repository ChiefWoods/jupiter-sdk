import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const POSITION_CLOSED_DISCRIMINATOR = new Uint8Array([157, 163, 227, 228, 13, 97, 138, 121]);

export function getPositionClosedDiscriminatorBytes(): Uint8Array {
    return POSITION_CLOSED_DISCRIMINATOR;
}

export type PositionClosed = {
    position: Address;
    marketId: string;
    owner: Address;
    isYes: boolean;
    closedBy: Address;
    timestamp: bigint;
};

function getPositionClosedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['position', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['isYes', getBooleanDecoder()],
            ['closedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(POSITION_CLOSED_DISCRIMINATOR)],
    );
}

export function parsePositionClosed(data: Uint8Array): PositionClosed {
    if (!POSITION_CLOSED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PositionClosed discriminator mismatch');
    }
    const decoded = getPositionClosedDecoder().decode(data);
    return decoded as PositionClosed;
}
