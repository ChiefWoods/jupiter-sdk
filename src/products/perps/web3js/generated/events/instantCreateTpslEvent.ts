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

export const INSTANT_CREATE_TPSL_DISCRIMINATOR = new Uint8Array([242, 54, 6, 95, 24, 141, 103, 198]);

export function getInstantCreateTpslEventDiscriminatorBytes(): Uint8Array {
    return INSTANT_CREATE_TPSL_DISCRIMINATOR;
}

export type InstantCreateTpsl = {
    owner: Address;
    pool: Address;
    positionKey: Address;
    positionSide: number;
    positionMint: Address;
    positionCustody: Address;
    positionCollateralCustody: Address;
    positionRequestKey: Address;
    positionRequestMint: Address;
    sizeUsdDelta: bigint;
    collateralDelta: bigint;
    entirePosition: boolean;
    openTime: bigint;
};

function getInstantCreateTpslDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionSide', getU8Decoder()],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
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
            ['entirePosition', getBooleanDecoder()],
            ['openTime', getI64Decoder()],
        ]),
        [getConstantDecoder(INSTANT_CREATE_TPSL_DISCRIMINATOR)],
    );
}

export function parseInstantCreateTpsl(data: Uint8Array): InstantCreateTpsl {
    if (!INSTANT_CREATE_TPSL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InstantCreateTpsl discriminator mismatch');
    }
    const decoded = getInstantCreateTpslDecoder().decode(data);
    return decoded as InstantCreateTpsl;
}
