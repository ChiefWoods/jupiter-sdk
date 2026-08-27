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

export const LOG_UNPAUSE_USER_DISCRIMINATOR = new Uint8Array([170, 91, 132, 96, 179, 77, 168, 26]);

export function getLogUnpauseUserDiscriminatorBytes(): Uint8Array {
    return LOG_UNPAUSE_USER_DISCRIMINATOR;
}

export type LogUnpauseUser = { dexId: number; protocol: Address; unpauseSupply: boolean; unpauseBorrow: boolean };

function getLogUnpauseUserDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['unpauseSupply', getBooleanDecoder()],
            ['unpauseBorrow', getBooleanDecoder()],
        ]),
        [getConstantDecoder(LOG_UNPAUSE_USER_DISCRIMINATOR)],
    );
}

export function parseLogUnpauseUser(data: Uint8Array): LogUnpauseUser {
    if (!LOG_UNPAUSE_USER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUnpauseUser discriminator mismatch');
    }
    const decoded = getLogUnpauseUserDecoder().decode(data);
    return decoded as LogUnpauseUser;
}
