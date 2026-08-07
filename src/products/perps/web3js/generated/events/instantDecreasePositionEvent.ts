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

export const INSTANT_DECREASE_POSITION_DISCRIMINATOR = new Uint8Array([171, 173, 106, 25, 239, 190, 58, 59]);

export function getInstantDecreasePositionEventDiscriminatorBytes(): Uint8Array {
    return INSTANT_DECREASE_POSITION_DISCRIMINATOR;
}

export type InstantDecreasePosition = {
    positionKey: Address;
    positionSide: number;
    positionCustody: Address;
    positionCollateralCustody: Address;
    positionSizeUsd: bigint;
    positionMint: Address;
    desiredMint: Address;
    hasProfit: boolean;
    pnlDelta: bigint;
    owner: Address;
    pool: Address;
    sizeUsdDelta: bigint;
    transferAmountUsd: bigint;
    transferToken: bigint;
    price: bigint;
    priceSlippage: bigint;
    feeUsd: bigint;
    openTime: bigint;
    referral: Option<Address>;
    positionFeeUsd: bigint;
    fundingFeeUsd: bigint;
    originalPositionCollateralUsd: bigint;
    positionCollateralUsd: bigint;
    priceImpactFeeUsd: bigint;
    positionOpenTime: bigint;
    positionPrice: bigint;
    positionRequest: Option<Address>;
};

function getInstantDecreasePositionDecoder() {
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
            ['desiredMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['hasProfit', getBooleanDecoder()],
            ['pnlDelta', getU64Decoder()],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sizeUsdDelta', getU64Decoder()],
            ['transferAmountUsd', getU64Decoder()],
            ['transferToken', getU64Decoder()],
            ['price', getU64Decoder()],
            ['priceSlippage', getU64Decoder()],
            ['feeUsd', getU64Decoder()],
            ['openTime', getI64Decoder()],
            [
                'referral',
                getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
            ],
            ['positionFeeUsd', getU64Decoder()],
            ['fundingFeeUsd', getU64Decoder()],
            ['originalPositionCollateralUsd', getU64Decoder()],
            ['positionCollateralUsd', getU64Decoder()],
            ['priceImpactFeeUsd', getU64Decoder()],
            ['positionOpenTime', getI64Decoder()],
            ['positionPrice', getU64Decoder()],
            [
                'positionRequest',
                getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
            ],
        ]),
        [getConstantDecoder(INSTANT_DECREASE_POSITION_DISCRIMINATOR)],
    );
}

export function parseInstantDecreasePosition(data: Uint8Array): InstantDecreasePosition {
    if (!INSTANT_DECREASE_POSITION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('INSTANTDECREASEPOSITION discriminator mismatch');
    }
    const decoded = getInstantDecreasePositionDecoder().decode(data);
    return decoded as InstantDecreasePosition;
}
