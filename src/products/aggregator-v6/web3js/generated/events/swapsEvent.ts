import { getArrayDecoder, getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';
import { getSwapEventV2Decoder, type SwapEventV2 } from '../types/swapEventV2';

export const SWAPS_DISCRIMINATOR = new Uint8Array([152, 47, 78, 235, 192, 96, 110, 106]);

export function getSwapsEventDiscriminatorBytes(): Uint8Array {
    return SWAPS_DISCRIMINATOR;
}

export type Swaps = { swapEvents: Array<SwapEventV2> };

function getSwapsDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['swapEvents', getArrayDecoder(getSwapEventV2Decoder())]]), [
        getConstantDecoder(SWAPS_DISCRIMINATOR),
    ]);
}

export function parseSwaps(data: Uint8Array): Swaps {
    if (!SWAPS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('SWAPS discriminator mismatch');
    }
    const decoded = getSwapsDecoder().decode(data);
    return decoded as Swaps;
}
