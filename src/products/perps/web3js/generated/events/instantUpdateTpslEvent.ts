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

export const INSTANT_UPDATE_TPSL_DISCRIMINATOR = new Uint8Array([177, 22, 47, 37, 120, 246, 17, 101]);

export function getInstantUpdateTpslEventDiscriminatorBytes(): Uint8Array {
    return INSTANT_UPDATE_TPSL_DISCRIMINATOR;
}

export type InstantUpdateTpsl = {
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
    updateTime: bigint;
};

function getInstantUpdateTpslDecoder() {
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
            ['updateTime', getI64Decoder()],
        ]),
        [getConstantDecoder(INSTANT_UPDATE_TPSL_DISCRIMINATOR)],
    );
}

export function parseInstantUpdateTpsl(data: Uint8Array): InstantUpdateTpsl {
    if (!INSTANT_UPDATE_TPSL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('InstantUpdateTpsl discriminator mismatch');
    }
    const decoded = getInstantUpdateTpslDecoder().decode(data);
    return decoded as InstantUpdateTpsl;
}
