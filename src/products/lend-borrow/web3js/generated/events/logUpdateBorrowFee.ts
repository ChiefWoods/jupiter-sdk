import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU8Decoder } from '@solana/codecs';

export const LOG_UPDATE_BORROW_FEE_DISCRIMINATOR = new Uint8Array([33, 134, 42, 66, 16, 167, 119, 196]);

export function getLogUpdateBorrowFeeDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_BORROW_FEE_DISCRIMINATOR;
}

export type LogUpdateBorrowFee = { borrowFee: number };

function getLogUpdateBorrowFeeDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['borrowFee', getU8Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_BORROW_FEE_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateBorrowFee(data: Uint8Array): LogUpdateBorrowFee {
    if (!LOG_UPDATE_BORROW_FEE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEBORROWFEE discriminator mismatch');
    }
    const decoded = getLogUpdateBorrowFeeDecoder().decode(data);
    return decoded as LogUpdateBorrowFee;
}
