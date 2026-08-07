import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const REDEEM_V0_DISCRIMINATOR = new Uint8Array([50, 202, 68, 30, 122, 77, 84, 153]);

export function getRedeemV0EventDiscriminatorBytes(): Uint8Array {
    return REDEEM_V0_DISCRIMINATOR;
}

export type RedeemV0 = {
    amount: bigint;
    netAmount: bigint;
    oraclePrice: bigint;
    oneToOneAmount: bigint;
    oracleAmount: bigint;
    redeemAmount: bigint;
};

function getRedeemV0Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amount', getU64Decoder()],
            ['netAmount', getU64Decoder()],
            ['oraclePrice', getU64Decoder()],
            ['oneToOneAmount', getU64Decoder()],
            ['oracleAmount', getU64Decoder()],
            ['redeemAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(REDEEM_V0_DISCRIMINATOR)],
    );
}

export function parseRedeemV0(data: Uint8Array): RedeemV0 {
    if (!REDEEM_V0_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('REDEEMV0 discriminator mismatch');
    }
    const decoded = getRedeemV0Decoder().decode(data);
    return decoded as RedeemV0;
}
