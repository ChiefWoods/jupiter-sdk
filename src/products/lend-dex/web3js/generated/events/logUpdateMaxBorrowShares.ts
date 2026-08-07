import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_MAX_BORROW_SHARES_DISCRIMINATOR = new Uint8Array([22, 124, 242, 112, 255, 39, 100, 206]);

export function getLogUpdateMaxBorrowSharesDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_MAX_BORROW_SHARES_DISCRIMINATOR;
}

export type LogUpdateMaxBorrowShares = { dexId: number; maxBorrowShares: bigint };

function getLogUpdateMaxBorrowSharesDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['maxBorrowShares', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_MAX_BORROW_SHARES_DISCRIMINATOR)],
    );
}

export function parseLogUpdateMaxBorrowShares(data: Uint8Array): LogUpdateMaxBorrowShares {
    if (!LOG_UPDATE_MAX_BORROW_SHARES_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEMAXBORROWSHARES discriminator mismatch');
    }
    const decoded = getLogUpdateMaxBorrowSharesDecoder().decode(data);
    return decoded as LogUpdateMaxBorrowShares;
}
