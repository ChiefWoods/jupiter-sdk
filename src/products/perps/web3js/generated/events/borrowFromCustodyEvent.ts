import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const BORROW_FROM_CUSTODY_DISCRIMINATOR = new Uint8Array([23, 121, 131, 68, 168, 70, 14, 76]);

export function getBorrowFromCustodyEventDiscriminatorBytes(): Uint8Array {
    return BORROW_FROM_CUSTODY_DISCRIMINATOR;
}

export type BorrowFromCustody = {
    owner: Address;
    pool: Address;
    positionKey: Address;
    positionMint: Address;
    positionCustody: Address;
    sizeCustodyToken: bigint;
    collateralAmount: bigint;
    collateralAmountUsd: bigint;
    marginUsd: bigint;
    updateTime: bigint;
};

function getBorrowFromCustodyDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sizeCustodyToken', getU64Decoder()],
            ['collateralAmount', getU64Decoder()],
            ['collateralAmountUsd', getU64Decoder()],
            ['marginUsd', getU64Decoder()],
            ['updateTime', getI64Decoder()],
        ]),
        [getConstantDecoder(BORROW_FROM_CUSTODY_DISCRIMINATOR)],
    );
}

export function parseBorrowFromCustody(data: Uint8Array): BorrowFromCustody {
    if (!BORROW_FROM_CUSTODY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('BORROWFROMCUSTODY discriminator mismatch');
    }
    const decoded = getBorrowFromCustodyDecoder().decode(data);
    return decoded as BorrowFromCustody;
}
