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

export const POOL_SWAP_EXACT_OUT_DISCRIMINATOR = new Uint8Array([121, 118, 11, 11, 198, 66, 142, 115]);

export function getPoolSwapExactOutEventDiscriminatorBytes(): Uint8Array {
    return POOL_SWAP_EXACT_OUT_DISCRIMINATOR;
}

export type PoolSwapExactOut = {
    receivingCustodyKey: Address;
    dispensingCustodyKey: Address;
    poolKey: Address;
    amountIn: bigint;
    amountInAfterFees: bigint;
    amountOut: bigint;
    swapUsdAmount: bigint;
    feeBps: bigint;
    ownerKey: Address;
    receivingAccountKey: Address;
};

function getPoolSwapExactOutDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            [
                'receivingCustodyKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            [
                'dispensingCustodyKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['poolKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amountIn', getU64Decoder()],
            ['amountInAfterFees', getU64Decoder()],
            ['amountOut', getU64Decoder()],
            ['swapUsdAmount', getU64Decoder()],
            ['feeBps', getU64Decoder()],
            ['ownerKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'receivingAccountKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
        ]),
        [getConstantDecoder(POOL_SWAP_EXACT_OUT_DISCRIMINATOR)],
    );
}

export function parsePoolSwapExactOut(data: Uint8Array): PoolSwapExactOut {
    if (!POOL_SWAP_EXACT_OUT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('POOLSWAPEXACTOUT discriminator mismatch');
    }
    const decoded = getPoolSwapExactOutDecoder().decode(data);
    return decoded as PoolSwapExactOut;
}
