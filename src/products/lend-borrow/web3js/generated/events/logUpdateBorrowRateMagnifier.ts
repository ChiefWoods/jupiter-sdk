import { getConstantDecoder, getHiddenPrefixDecoder, getI16Decoder, getStructDecoder } from '@solana/codecs';

export const LOG_UPDATE_BORROW_RATE_MAGNIFIER_DISCRIMINATOR = new Uint8Array([186, 23, 46, 117, 57, 111, 107, 51]);

export function getLogUpdateBorrowRateMagnifierDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_BORROW_RATE_MAGNIFIER_DISCRIMINATOR;
}

export type LogUpdateBorrowRateMagnifier = { borrowRateMagnifier: number };

function getLogUpdateBorrowRateMagnifierDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['borrowRateMagnifier', getI16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_BORROW_RATE_MAGNIFIER_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateBorrowRateMagnifier(data: Uint8Array): LogUpdateBorrowRateMagnifier {
    if (!LOG_UPDATE_BORROW_RATE_MAGNIFIER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEBORROWRATEMAGNIFIER discriminator mismatch');
    }
    const decoded = getLogUpdateBorrowRateMagnifierDecoder().decode(data);
    return decoded as LogUpdateBorrowRateMagnifier;
}
