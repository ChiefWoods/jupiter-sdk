import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const MINT_V0_DISCRIMINATOR = new Uint8Array([217, 98, 231, 213, 105, 77, 68, 88]);

export function getMintV0EventDiscriminatorBytes(): Uint8Array {
    return MINT_V0_DISCRIMINATOR;
}

export type MintV0 = {
    amount: bigint;
    netAmount: bigint;
    oraclePrice: bigint;
    oneToOneAmount: bigint;
    oracleAmount: bigint;
    mintAmount: bigint;
};

function getMintV0Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amount', getU64Decoder()],
            ['netAmount', getU64Decoder()],
            ['oraclePrice', getU64Decoder()],
            ['oneToOneAmount', getU64Decoder()],
            ['oracleAmount', getU64Decoder()],
            ['mintAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(MINT_V0_DISCRIMINATOR)],
    );
}

export function parseMintV0(data: Uint8Array): MintV0 {
    if (!MINT_V0_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('MintV0 discriminator mismatch');
    }
    const decoded = getMintV0Decoder().decode(data);
    return decoded as MintV0;
}
