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

export const LIQUIDATE_BORROW_POSITION_DISCRIMINATOR = new Uint8Array([11, 128, 252, 59, 49, 192, 56, 170]);

export function getLiquidateBorrowPositionEventDiscriminatorBytes(): Uint8Array {
    return LIQUIDATE_BORROW_POSITION_DISCRIMINATOR;
}

export type LiquidateBorrowPosition = {
    positionKey: Address;
    positionCustody: Address;
    positionSizeUsd: bigint;
    owner: Address;
    pool: Address;
    collateralLockedInUsd: bigint;
    collateralLockedInLp: bigint;
    remainingCollateralInLp: bigint;
    custodyTokenPrice: bigint;
    totalBorrowsInUsd: bigint;
    liquidationFeeUsd: bigint;
    liquidationTime: bigint;
};

function getLiquidateBorrowPositionDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionSizeUsd', getU64Decoder()],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['collateralLockedInUsd', getU64Decoder()],
            ['collateralLockedInLp', getU64Decoder()],
            ['remainingCollateralInLp', getU64Decoder()],
            ['custodyTokenPrice', getU64Decoder()],
            ['totalBorrowsInUsd', getU64Decoder()],
            ['liquidationFeeUsd', getU64Decoder()],
            ['liquidationTime', getI64Decoder()],
        ]),
        [getConstantDecoder(LIQUIDATE_BORROW_POSITION_DISCRIMINATOR)],
    );
}

export function parseLiquidateBorrowPosition(data: Uint8Array): LiquidateBorrowPosition {
    if (!LIQUIDATE_BORROW_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LIQUIDATEBORROWPOSITION discriminator mismatch');
    }
    const decoded = getLiquidateBorrowPositionDecoder().decode(data);
    return decoded as LiquidateBorrowPosition;
}
