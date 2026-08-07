import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_SWAP_DISCRIMINATOR = new Uint8Array([202, 242, 228, 28, 37, 194, 52, 34]);

export function getLogSwapDiscriminatorBytes(): Uint8Array {
    return LOG_SWAP_DISCRIMINATOR;
}

export type LogSwap = { dexId: number; swap0To1: boolean; amountIn: bigint; amountOut: bigint; to: Address };

function getLogSwapDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['swap0To1', getBooleanDecoder()],
            ['amountIn', getU64Decoder()],
            ['amountOut', getU64Decoder()],
            ['to', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_SWAP_DISCRIMINATOR)],
    );
}

export function parseLogSwap(data: Uint8Array): LogSwap {
    if (!LOG_SWAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGSWAP discriminator mismatch');
    }
    const decoded = getLogSwapDecoder().decode(data);
    return decoded as LogSwap;
}
