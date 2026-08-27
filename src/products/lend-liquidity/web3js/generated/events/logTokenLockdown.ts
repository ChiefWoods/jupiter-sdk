import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_TOKEN_LOCKDOWN_DISCRIMINATOR = new Uint8Array([2, 103, 171, 11, 0, 27, 20, 40]);

export function getLogTokenLockdownDiscriminatorBytes(): Uint8Array {
    return LOG_TOKEN_LOCKDOWN_DISCRIMINATOR;
}

export type LogTokenLockdown = { mint: Address; suspend: boolean };

function getLogTokenLockdownDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['suspend', getBooleanDecoder()],
        ]),
        [getConstantDecoder(LOG_TOKEN_LOCKDOWN_DISCRIMINATOR)],
    );
}

export function parseLogTokenLockdown(data: Uint8Array): LogTokenLockdown {
    if (!LOG_TOKEN_LOCKDOWN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogTokenLockdown discriminator mismatch');
    }
    const decoded = getLogTokenLockdownDecoder().decode(data);
    return decoded as LogTokenLockdown;
}
