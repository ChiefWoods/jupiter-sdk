import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_BORROW_RATE_CAP_DISCRIMINATOR = new Uint8Array([156, 131, 232, 94, 254, 156, 14, 117]);

export function getLogBorrowRateCapDiscriminatorBytes(): Uint8Array {
    return LOG_BORROW_RATE_CAP_DISCRIMINATOR;
}

export type LogBorrowRateCap = { token: Address };

function getLogBorrowRateCapDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_BORROW_RATE_CAP_DISCRIMINATOR)],
    );
}

export function parseLogBorrowRateCap(data: Uint8Array): LogBorrowRateCap {
    if (!LOG_BORROW_RATE_CAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGBORROWRATECAP discriminator mismatch');
    }
    const decoded = getLogBorrowRateCapDecoder().decode(data);
    return decoded as LogBorrowRateCap;
}
