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

export const SWAP_DISCRIMINATOR = new Uint8Array([64, 198, 205, 232, 38, 8, 113, 226]);

export function getSwapEventDiscriminatorBytes(): Uint8Array {
    return SWAP_DISCRIMINATOR;
}

export type Swap = { amm: Address; inputMint: Address; inputAmount: bigint; outputMint: Address; outputAmount: bigint };

function getSwapDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['amm', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['inputMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['inputAmount', getU64Decoder()],
            ['outputMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['outputAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(SWAP_DISCRIMINATOR)],
    );
}

export function parseSwap(data: Uint8Array): Swap {
    if (!SWAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('SWAP discriminator mismatch');
    }
    const decoded = getSwapDecoder().decode(data);
    return decoded as Swap;
}
