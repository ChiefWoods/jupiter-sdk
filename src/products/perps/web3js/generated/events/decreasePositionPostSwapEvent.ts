import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getOptionDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
    type Option,
} from '@solana/codecs';

export const DECREASE_POSITION_POST_SWAP_DISCRIMINATOR = new Uint8Array([23, 210, 16, 233, 98, 245, 89, 82]);

export function getDecreasePositionPostSwapEventDiscriminatorBytes(): Uint8Array {
    return DECREASE_POSITION_POST_SWAP_DISCRIMINATOR;
}

export type DecreasePositionPostSwap = {
    positionRequestKey: Address;
    swapAmount: bigint;
    jupiterMinimumOut: Option<bigint>;
};

function getDecreasePositionPostSwapDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            [
                'positionRequestKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['swapAmount', getU64Decoder()],
            ['jupiterMinimumOut', getOptionDecoder(getU64Decoder())],
        ]),
        [getConstantDecoder(DECREASE_POSITION_POST_SWAP_DISCRIMINATOR)],
    );
}

export function parseDecreasePositionPostSwap(data: Uint8Array): DecreasePositionPostSwap {
    if (!DECREASE_POSITION_POST_SWAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('DECREASEPOSITIONPOSTSWAP discriminator mismatch');
    }
    const decoded = getDecreasePositionPostSwapDecoder().decode(data);
    return decoded as DecreasePositionPostSwap;
}
