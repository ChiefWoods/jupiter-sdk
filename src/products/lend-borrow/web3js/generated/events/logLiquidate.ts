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

export const LOG_LIQUIDATE_DISCRIMINATOR = new Uint8Array([154, 128, 202, 147, 65, 233, 195, 73]);

export function getLogLiquidateDiscriminatorBytes(): Uint8Array {
    return LOG_LIQUIDATE_DISCRIMINATOR;
}

export type LogLiquidate = { signer: Address; colAmount: bigint; debtAmount: bigint; to: Address };

function getLogLiquidateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['signer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['colAmount', getU64Decoder()],
            ['debtAmount', getU64Decoder()],
            ['to', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_LIQUIDATE_DISCRIMINATOR)],
    );
}

export function parseLogLiquidate(data: Uint8Array): LogLiquidate {
    if (!LOG_LIQUIDATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogLiquidate discriminator mismatch');
    }
    const decoded = getLogLiquidateDecoder().decode(data);
    return decoded as LogLiquidate;
}
