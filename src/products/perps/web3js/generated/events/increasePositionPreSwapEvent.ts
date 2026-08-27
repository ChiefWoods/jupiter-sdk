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

export const INCREASE_POSITION_PRE_SWAP_DISCRIMINATOR = new Uint8Array([237, 107, 9, 139, 22, 75, 4, 213]);

export function getIncreasePositionPreSwapEventDiscriminatorBytes(): Uint8Array {
    return INCREASE_POSITION_PRE_SWAP_DISCRIMINATOR;
}

export type IncreasePositionPreSwap = {
    positionRequestKey: Address;
    transferAmount: bigint;
    collateralCustodyPreSwapAmount: bigint;
};

function getIncreasePositionPreSwapDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            [
                'positionRequestKey',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['transferAmount', getU64Decoder()],
            ['collateralCustodyPreSwapAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(INCREASE_POSITION_PRE_SWAP_DISCRIMINATOR)],
    );
}

export function parseIncreasePositionPreSwap(data: Uint8Array): IncreasePositionPreSwap {
    if (!INCREASE_POSITION_PRE_SWAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('IncreasePositionPreSwap discriminator mismatch');
    }
    const decoded = getIncreasePositionPreSwapDecoder().decode(data);
    return decoded as IncreasePositionPreSwap;
}
