import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LIQUIDATE_FULL_POSITION_DISCRIMINATOR = new Uint8Array([128, 101, 71, 168, 128, 72, 86, 84]);

export function getLiquidateFullPositionEventDiscriminatorBytes(): Uint8Array {
    return LIQUIDATE_FULL_POSITION_DISCRIMINATOR;
}

export type LiquidateFullPosition = {
    positionKey: Address;
    positionSide: number;
    positionCustody: Address;
    positionCollateralCustody: Address;
    positionCollateralMint: Address;
    positionMint: Address;
    positionSizeUsd: bigint;
    hasProfit: boolean;
    pnlDelta: bigint;
    owner: Address;
    pool: Address;
    transferAmountUsd: bigint;
    transferToken: bigint;
    price: bigint;
    feeUsd: bigint;
    liquidationFeeUsd: bigint;
    openTime: bigint;
    positionFeeUsd: bigint;
    fundingFeeUsd: bigint;
    priceImpactFeeUsd: bigint;
    originalPositionCollateralUsd: bigint;
    positionCollateralUsd: bigint;
    positionOpenTime: bigint;
    positionPrice: bigint;
};

function getLiquidateFullPositionDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionSide', getU8Decoder()],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'positionCollateralCustody',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            [
                'positionCollateralMint',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionSizeUsd', getU64Decoder()],
            ['hasProfit', getBooleanDecoder()],
            ['pnlDelta', getU64Decoder()],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['transferAmountUsd', getU64Decoder()],
            ['transferToken', getU64Decoder()],
            ['price', getU64Decoder()],
            ['feeUsd', getU64Decoder()],
            ['liquidationFeeUsd', getU64Decoder()],
            ['openTime', getI64Decoder()],
            ['positionFeeUsd', getU64Decoder()],
            ['fundingFeeUsd', getU64Decoder()],
            ['priceImpactFeeUsd', getU64Decoder()],
            ['originalPositionCollateralUsd', getU64Decoder()],
            ['positionCollateralUsd', getU64Decoder()],
            ['positionOpenTime', getI64Decoder()],
            ['positionPrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LIQUIDATE_FULL_POSITION_DISCRIMINATOR)],
    );
}

export function parseLiquidateFullPosition(data: Uint8Array): LiquidateFullPosition {
    if (!LIQUIDATE_FULL_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LiquidateFullPosition discriminator mismatch');
    }
    const decoded = getLiquidateFullPositionDecoder().decode(data);
    return decoded as LiquidateFullPosition;
}
