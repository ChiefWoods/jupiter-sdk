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

export const POOL_SWAP_DISCRIMINATOR = new Uint8Array([40, 107, 212, 26, 223, 136, 39, 220]);

export function getPoolSwapEventDiscriminatorBytes(): Uint8Array {
    return POOL_SWAP_DISCRIMINATOR;
}

export type PoolSwap = {
    receivingCustodyKey: Address;
    dispensingCustodyKey: Address;
    poolKey: Address;
    amountIn: bigint;
    amountOut: bigint;
    swapUsdAmount: bigint;
    amountOutAfterFees: bigint;
    feeBps: bigint;
    ownerKey: Address;
    receivingAccountKey: Address;
};

function getPoolSwapDecoder() {
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
            ['amountOut', getU64Decoder()],
            ['swapUsdAmount', getU64Decoder()],
            ['amountOutAfterFees', getU64Decoder()],
            ['feeBps', getU64Decoder()],
            ['ownerKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'receivingAccountKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
        ]),
        [getConstantDecoder(POOL_SWAP_DISCRIMINATOR)],
    );
}

export function parsePoolSwap(data: Uint8Array): PoolSwap {
    if (!POOL_SWAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('POOLSWAP discriminator mismatch');
    }
    const decoded = getPoolSwapDecoder().decode(data);
    return decoded as PoolSwap;
}
