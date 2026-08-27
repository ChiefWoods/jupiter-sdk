import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU128Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const ADD_LIQUIDITY_DISCRIMINATOR = new Uint8Array([27, 178, 153, 186, 47, 196, 140, 45]);

export function getAddLiquidityEventDiscriminatorBytes(): Uint8Array {
    return ADD_LIQUIDITY_DISCRIMINATOR;
}

export type AddLiquidity = {
    custodyKey: Address;
    poolKey: Address;
    tokenAmountIn: bigint;
    prePoolAmountUsd: bigint;
    tokenAmountUsd: bigint;
    feeBps: bigint;
    tokenAmountAfterFee: bigint;
    mintAmountUsd: bigint;
    lpAmount: bigint;
    postPoolAmountUsd: bigint;
};

function getAddLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['custodyKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['poolKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['tokenAmountIn', getU64Decoder()],
            ['prePoolAmountUsd', getU128Decoder()],
            ['tokenAmountUsd', getU64Decoder()],
            ['feeBps', getU64Decoder()],
            ['tokenAmountAfterFee', getU64Decoder()],
            ['mintAmountUsd', getU64Decoder()],
            ['lpAmount', getU64Decoder()],
            ['postPoolAmountUsd', getU128Decoder()],
        ]),
        [getConstantDecoder(ADD_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseAddLiquidity(data: Uint8Array): AddLiquidity {
    if (!ADD_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('AddLiquidity discriminator mismatch');
    }
    const decoded = getAddLiquidityDecoder().decode(data);
    return decoded as AddLiquidity;
}
