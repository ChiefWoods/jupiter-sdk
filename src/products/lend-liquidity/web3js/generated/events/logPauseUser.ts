import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_PAUSE_USER_DISCRIMINATOR = new Uint8Array([100, 17, 114, 224, 180, 30, 52, 170]);

export function getLogPauseUserDiscriminatorBytes(): Uint8Array {
    return LOG_PAUSE_USER_DISCRIMINATOR;
}

export type LogPauseUser = { user: Address; mint: Address; status: number };

function getLogPauseUserDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['status', getU8Decoder()],
        ]),
        [getConstantDecoder(LOG_PAUSE_USER_DISCRIMINATOR)],
    );
}

export function parseLogPauseUser(data: Uint8Array): LogPauseUser {
    if (!LOG_PAUSE_USER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogPauseUser discriminator mismatch');
    }
    const decoded = getLogPauseUserDecoder().decode(data);
    return decoded as LogPauseUser;
}
