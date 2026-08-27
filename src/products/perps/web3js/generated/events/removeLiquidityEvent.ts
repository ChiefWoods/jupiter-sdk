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

export const REMOVE_LIQUIDITY_DISCRIMINATOR = new Uint8Array([141, 199, 182, 123, 159, 94, 215, 102]);

export function getRemoveLiquidityEventDiscriminatorBytes(): Uint8Array {
    return REMOVE_LIQUIDITY_DISCRIMINATOR;
}

export type RemoveLiquidity = {
    custodyKey: Address;
    poolKey: Address;
    lpAmountIn: bigint;
    removeAmountUsd: bigint;
    feeBps: bigint;
    removeTokenAmount: bigint;
    tokenAmountAfterFee: bigint;
    postPoolAmountUsd: bigint;
};

function getRemoveLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['custodyKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['poolKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['lpAmountIn', getU64Decoder()],
            ['removeAmountUsd', getU64Decoder()],
            ['feeBps', getU64Decoder()],
            ['removeTokenAmount', getU64Decoder()],
            ['tokenAmountAfterFee', getU64Decoder()],
            ['postPoolAmountUsd', getU128Decoder()],
        ]),
        [getConstantDecoder(REMOVE_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseRemoveLiquidity(data: Uint8Array): RemoveLiquidity {
    if (!REMOVE_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('RemoveLiquidity discriminator mismatch');
    }
    const decoded = getRemoveLiquidityDecoder().decode(data);
    return decoded as RemoveLiquidity;
}
