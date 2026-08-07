import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_CLOSE_POSITION_DISCRIMINATOR = new Uint8Array([225, 156, 13, 36, 189, 95, 170, 92]);

export function getLogClosePositionDiscriminatorBytes(): Uint8Array {
    return LOG_CLOSE_POSITION_DISCRIMINATOR;
}

export type LogClosePosition = { signer: Address; positionId: number; vaultId: number; positionMint: Address };

function getLogClosePositionDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['signer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionId', getU32Decoder()],
            ['vaultId', getU16Decoder()],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_CLOSE_POSITION_DISCRIMINATOR)],
    );
}

export function parseLogClosePosition(data: Uint8Array): LogClosePosition {
    if (!LOG_CLOSE_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGCLOSEPOSITION discriminator mismatch');
    }
    const decoded = getLogClosePositionDecoder().decode(data);
    return decoded as LogClosePosition;
}
