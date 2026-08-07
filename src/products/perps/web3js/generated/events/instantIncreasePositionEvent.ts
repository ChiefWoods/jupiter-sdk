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

export const INSTANT_INCREASE_POSITION_DISCRIMINATOR = new Uint8Array([205, 236, 57, 4, 209, 106, 87, 69]);

export function getInstantIncreasePositionEventDiscriminatorBytes(): Uint8Array {
    return INSTANT_INCREASE_POSITION_DISCRIMINATOR;
}

export type InstantIncreasePosition = {
    positionKey: Address;
    positionSide: number;
    positionCustody: Address;
    positionCollateralCustody: Address;
    positionSizeUsd: bigint;
    positionMint: Address;
    owner: Address;
    pool: Address;
    sizeUsdDelta: bigint;
    collateralUsdDelta: bigint;
    collateralTokenDelta: bigint;
    price: bigint;
    priceSlippage: bigint;
    feeToken: bigint;
    feeUsd: bigint;
    openTime: bigint;
    referral: Option<Address>;
    positionFeeUsd: bigint;
    fundingFeeUsd: bigint;
    priceImpactFeeUsd: bigint;
};

function getInstantIncreasePositionDecoder() {
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
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sizeUsdDelta', getU64Decoder()],
            ['collateralUsdDelta', getU64Decoder()],
            ['collateralTokenDelta', getU64Decoder()],
            ['price', getU64Decoder()],
            ['priceSlippage', getU64Decoder()],
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
        [getConstantDecoder(INSTANT_INCREASE_POSITION_DISCRIMINATOR)],
    );
}

export function parseInstantIncreasePosition(data: Uint8Array): InstantIncreasePosition {
    if (!INSTANT_INCREASE_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('INSTANTINCREASEPOSITION discriminator mismatch');
    }
    const decoded = getInstantIncreasePositionDecoder().decode(data);
    return decoded as InstantIncreasePosition;
}
