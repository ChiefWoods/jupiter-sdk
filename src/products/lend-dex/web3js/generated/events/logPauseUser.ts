import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_PAUSE_USER_DISCRIMINATOR = new Uint8Array([100, 17, 114, 224, 180, 30, 52, 170]);

export function getLogPauseUserDiscriminatorBytes(): Uint8Array {
    return LOG_PAUSE_USER_DISCRIMINATOR;
}

export type LogPauseUser = { dexId: number; protocol: Address; pauseSupply: boolean; pauseBorrow: boolean };

function getLogPauseUserDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pauseSupply', getBooleanDecoder()],
            ['pauseBorrow', getBooleanDecoder()],
        ]),
        [getConstantDecoder(LOG_PAUSE_USER_DISCRIMINATOR)],
    );
}

export function parseLogPauseUser(data: Uint8Array): LogPauseUser {
    if (!LOG_PAUSE_USER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGPAUSEUSER discriminator mismatch');
    }
    const decoded = getLogPauseUserDecoder().decode(data);
    return decoded as LogPauseUser;
}
