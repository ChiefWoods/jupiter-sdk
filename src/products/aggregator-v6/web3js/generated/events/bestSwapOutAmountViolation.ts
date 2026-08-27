import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU64Decoder } from '@solana/codecs';

export const BEST_SWAP_OUT_AMOUNT_VIOLATION_DISCRIMINATOR = new Uint8Array([124, 66, 196, 51, 218, 173, 46, 93]);

export function getBestSwapOutAmountViolationDiscriminatorBytes(): Uint8Array {
    return BEST_SWAP_OUT_AMOUNT_VIOLATION_DISCRIMINATOR;
}

export type BestSwapOutAmountViolation = { expectedOutAmount: bigint; outAmount: bigint };

function getBestSwapOutAmountViolationDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['expectedOutAmount', getU64Decoder()],
            ['outAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(BEST_SWAP_OUT_AMOUNT_VIOLATION_DISCRIMINATOR)],
    );
}

export function parseBestSwapOutAmountViolation(data: Uint8Array): BestSwapOutAmountViolation {
    if (!BEST_SWAP_OUT_AMOUNT_VIOLATION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('BestSwapOutAmountViolation discriminator mismatch');
    }
    const decoded = getBestSwapOutAmountViolationDecoder().decode(data);
    return decoded as BestSwapOutAmountViolation;
}
