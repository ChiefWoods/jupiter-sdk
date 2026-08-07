import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const REDEEM_V1_DISCRIMINATOR = new Uint8Array([67, 51, 207, 92, 219, 144, 44, 2]);

export function getRedeemV1EventDiscriminatorBytes(): Uint8Array {
    return REDEEM_V1_DISCRIMINATOR;
}

export type RedeemV1 = {
    amount: bigint;
    netAmount: bigint;
    oraclePrice: bigint;
    oneToOneAmount: bigint;
    oracleAmount: bigint;
    redeemAmount: bigint;
    collateral: Address;
    benefactor: Address;
};

function getRedeemV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amount', getU64Decoder()],
            ['netAmount', getU64Decoder()],
            ['oraclePrice', getU64Decoder()],
            ['oneToOneAmount', getU64Decoder()],
            ['oracleAmount', getU64Decoder()],
            ['redeemAmount', getU64Decoder()],
            ['collateral', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['benefactor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(REDEEM_V1_DISCRIMINATOR)],
    );
}

export function parseRedeemV1(data: Uint8Array): RedeemV1 {
    if (!REDEEM_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('REDEEMV1 discriminator mismatch');
    }
    const decoded = getRedeemV1Decoder().decode(data);
    return decoded as RedeemV1;
}
