import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const SET_FLASHLOAN_FEE_DISCRIMINATOR = new Uint8Array([112, 164, 66, 251, 191, 56, 0, 47]);

export function getSetFlashloanFeeDiscriminatorBytes(): Uint8Array {
    return SET_FLASHLOAN_FEE_DISCRIMINATOR;
}

export type SetFlashloanFee = { flashloanFee: number };

function getSetFlashloanFeeDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['flashloanFee', getU16Decoder()]]), [
        getConstantDecoder(SET_FLASHLOAN_FEE_DISCRIMINATOR),
    ]);
}

export function parseSetFlashloanFee(data: Uint8Array): SetFlashloanFee {
    if (!SET_FLASHLOAN_FEE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('SetFlashloanFee discriminator mismatch');
    }
    const decoded = getSetFlashloanFeeDecoder().decode(data);
    return decoded as SetFlashloanFee;
}
