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

export const MINT_V1_DISCRIMINATOR = new Uint8Array([63, 113, 88, 48, 163, 187, 48, 83]);

export function getMintV1EventDiscriminatorBytes(): Uint8Array {
    return MINT_V1_DISCRIMINATOR;
}

export type MintV1 = {
    amount: bigint;
    netAmount: bigint;
    oraclePrice: bigint;
    oneToOneAmount: bigint;
    oracleAmount: bigint;
    mintAmount: bigint;
    collateral: Address;
    benefactor: Address;
};

function getMintV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amount', getU64Decoder()],
            ['netAmount', getU64Decoder()],
            ['oraclePrice', getU64Decoder()],
            ['oneToOneAmount', getU64Decoder()],
            ['oracleAmount', getU64Decoder()],
            ['mintAmount', getU64Decoder()],
            ['collateral', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['benefactor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(MINT_V1_DISCRIMINATOR)],
    );
}

export function parseMintV1(data: Uint8Array): MintV1 {
    if (!MINT_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('MINTV1 discriminator mismatch');
    }
    const decoded = getMintV1Decoder().decode(data);
    return decoded as MintV1;
}
