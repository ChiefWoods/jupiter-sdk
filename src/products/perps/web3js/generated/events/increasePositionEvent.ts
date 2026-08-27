import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
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

export const INCREASE_POSITION_DISCRIMINATOR = new Uint8Array([245, 113, 85, 52, 214, 187, 153, 132]);

export function getIncreasePositionEventDiscriminatorBytes(): Uint8Array {
    return INCREASE_POSITION_DISCRIMINATOR;
}

export type IncreasePosition = {
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
    positionRequestCollateralDelta: bigint;
    owner: Address;
    pool: Address;
    sizeUsdDelta: bigint;
    collateralUsdDelta: bigint;
    collateralTokenDelta: bigint;
    price: bigint;
    priceSlippage: Option<bigint>;
    feeToken: bigint;
    feeUsd: bigint;
    openTime: bigint;
    referral: Option<Address>;
    positionFeeUsd: bigint;
    fundingFeeUsd: bigint;
    priceImpactFeeUsd: bigint;
};

function getIncreasePositionDecoder() {
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
            ['positionRequestCollateralDelta', getU64Decoder()],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sizeUsdDelta', getU64Decoder()],
            ['collateralUsdDelta', getU64Decoder()],
            ['collateralTokenDelta', getU64Decoder()],
            ['price', getU64Decoder()],
            ['priceSlippage', getOptionDecoder(getU64Decoder())],
            ['feeToken', getU64Decoder()],
            ['feeUsd', getU64Decoder()],
            ['openTime', getI64Decoder()],
            [
                'referral',
                getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
            ],
            ['positionFeeUsd', getU64Decoder()],
            ['fundingFeeUsd', getU64Decoder()],
            ['priceImpactFeeUsd', getU64Decoder()],
        ]),
        [getConstantDecoder(INCREASE_POSITION_DISCRIMINATOR)],
    );
}

export function parseIncreasePosition(data: Uint8Array): IncreasePosition {
    if (!INCREASE_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('IncreasePosition discriminator mismatch');
    }
    const decoded = getIncreasePositionDecoder().decode(data);
    return decoded as IncreasePosition;
}
