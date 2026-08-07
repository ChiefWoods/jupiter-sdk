import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
    type Option,
} from '@solana/codecs';

export const DECREASE_POSITION_DISCRIMINATOR = new Uint8Array([64, 156, 43, 74, 109, 131, 16, 127]);

export function getDecreasePositionEventDiscriminatorBytes(): Uint8Array {
    return DECREASE_POSITION_DISCRIMINATOR;
}

export type DecreasePosition = {
    positionKey: Address;
    positionSide: number;
    positionCustody: Address;
    positionCollateralCustody: Address;
    positionSizeUsd: bigint;
    positionMint: Address;
    positionRequestKey: Address;
    positionRequestMint: Address;
    positionRequestChange: number;
    positionRequestType: number;
    hasProfit: boolean;
    pnlDelta: bigint;
    owner: Address;
    pool: Address;
    sizeUsdDelta: bigint;
    transferAmountUsd: bigint;
    transferToken: Option<bigint>;
    price: bigint;
    priceSlippage: Option<bigint>;
    feeUsd: bigint;
    openTime: bigint;
    referral: Option<Address>;
    positionFeeUsd: bigint;
    fundingFeeUsd: bigint;
    priceImpactFeeUsd: bigint;
    originalPositionCollateralUsd: bigint;
    positionCollateralUsd: bigint;
    positionOpenTime: bigint;
    positionPrice: bigint;
};

function getDecreasePositionDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionSide', getU8Decoder()],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'positionCollateralCustody',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['positionSizeUsd', getU64Decoder()],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'positionRequestKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            [
                'positionRequestMint',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['positionRequestChange', getU8Decoder()],
            ['positionRequestType', getU8Decoder()],
            ['hasProfit', getBooleanDecoder()],
            ['pnlDelta', getU64Decoder()],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sizeUsdDelta', getU64Decoder()],
            ['transferAmountUsd', getU64Decoder()],
            ['transferToken', getOptionDecoder(getU64Decoder())],
            ['price', getU64Decoder()],
            ['priceSlippage', getOptionDecoder(getU64Decoder())],
            ['feeUsd', getU64Decoder()],
            ['openTime', getI64Decoder()],
            [
                'referral',
                getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
            ],
            ['positionFeeUsd', getU64Decoder()],
            ['fundingFeeUsd', getU64Decoder()],
            ['priceImpactFeeUsd', getU64Decoder()],
            ['originalPositionCollateralUsd', getU64Decoder()],
            ['positionCollateralUsd', getU64Decoder()],
            ['positionOpenTime', getI64Decoder()],
            ['positionPrice', getU64Decoder()],
        ]),
        [getConstantDecoder(DECREASE_POSITION_DISCRIMINATOR)],
    );
}

export function parseDecreasePosition(data: Uint8Array): DecreasePosition {
    if (!DECREASE_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('DECREASEPOSITION discriminator mismatch');
    }
    const decoded = getDecreasePositionDecoder().decode(data);
    return decoded as DecreasePosition;
}
