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

export const CREATE_POSITION_REQUEST_DISCRIMINATOR = new Uint8Array([2, 238, 94, 53, 105, 211, 46, 186]);

export function getCreatePositionRequestEventDiscriminatorBytes(): Uint8Array {
    return CREATE_POSITION_REQUEST_DISCRIMINATOR;
}

export type CreatePositionRequest = {
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
    priceSlippage: Option<bigint>;
    jupiterMinimumOut: Option<bigint>;
    preSwapAmount: Option<bigint>;
    requestChange: number;
    openTime: bigint;
    referral: Option<Address>;
};

function getCreatePositionRequestDecoder() {
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
            ['priceSlippage', getOptionDecoder(getU64Decoder())],
            ['jupiterMinimumOut', getOptionDecoder(getU64Decoder())],
            ['preSwapAmount', getOptionDecoder(getU64Decoder())],
            ['requestChange', getU8Decoder()],
            ['openTime', getI64Decoder()],
            [
                'referral',
                getOptionDecoder(transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))),
            ],
        ]),
        [getConstantDecoder(CREATE_POSITION_REQUEST_DISCRIMINATOR)],
    );
}

export function parseCreatePositionRequest(data: Uint8Array): CreatePositionRequest {
    if (!CREATE_POSITION_REQUEST_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CREATEPOSITIONREQUEST discriminator mismatch');
    }
    const decoded = getCreatePositionRequestDecoder().decode(data);
    return decoded as CreatePositionRequest;
}
