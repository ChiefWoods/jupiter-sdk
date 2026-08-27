import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_PAYBACK_DEBT_LIQUIDITY_DISCRIMINATOR = new Uint8Array([230, 190, 245, 114, 113, 92, 173, 27]);

export function getLogPaybackDebtLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_PAYBACK_DEBT_LIQUIDITY_DISCRIMINATOR;
}

export type LogPaybackDebtLiquidity = {
    dexId: number;
    amount0: bigint;
    amount1: bigint;
    shares: bigint;
    user: Address;
    protocol: Address;
};

function getLogPaybackDebtLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['amount0', getU64Decoder()],
            ['amount1', getU64Decoder()],
            ['shares', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_PAYBACK_DEBT_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogPaybackDebtLiquidity(data: Uint8Array): LogPaybackDebtLiquidity {
    if (!LOG_PAYBACK_DEBT_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogPaybackDebtLiquidity discriminator mismatch');
    }
    const decoded = getLogPaybackDebtLiquidityDecoder().decode(data);
    return decoded as LogPaybackDebtLiquidity;
}
