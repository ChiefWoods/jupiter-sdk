import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const INSTANT_CREATE_LIMIT_ORDER_DISCRIMINATOR = new Uint8Array([10, 163, 85, 115, 129, 224, 80, 192]);

export function getInstantCreateLimitOrderEventDiscriminatorBytes(): Uint8Array {
    return INSTANT_CREATE_LIMIT_ORDER_DISCRIMINATOR;
}

export type InstantCreateLimitOrder = {
    owner: Address;
    pool: Address;
    positionKey: Address;
    positionSide: number;
    positionMint: Address;
    positionCustody: Address;
    positionCollateralMint: Address;
    positionCollateralCustody: Address;
    positionRequestKey: Address;
    positionRequestMint: Address;
    sizeUsdDelta: bigint;
    collateralDelta: bigint;
    openTime: bigint;
};

function getInstantCreateLimitOrderDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionSide', getU8Decoder()],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'positionCollateralMint',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            [
                'positionCollateralCustody',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            [
                'positionRequestKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            [
                'positionRequestMint',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['sizeUsdDelta', getU64Decoder()],
            ['collateralDelta', getU64Decoder()],
            ['openTime', getI64Decoder()],
        ]),
        [getConstantDecoder(INSTANT_CREATE_LIMIT_ORDER_DISCRIMINATOR)],
    );
}

export function parseInstantCreateLimitOrder(data: Uint8Array): InstantCreateLimitOrder {
    if (!INSTANT_CREATE_LIMIT_ORDER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InstantCreateLimitOrder discriminator mismatch');
    }
    const decoded = getInstantCreateLimitOrderDecoder().decode(data);
    return decoded as InstantCreateLimitOrder;
}
