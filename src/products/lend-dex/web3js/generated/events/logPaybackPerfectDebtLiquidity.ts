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

export const LOG_PAYBACK_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR = new Uint8Array([75, 233, 232, 38, 153, 31, 239, 109]);

export function getLogPaybackPerfectDebtLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_PAYBACK_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR;
}

export type LogPaybackPerfectDebtLiquidity = {
    dexId: number;
    shares: bigint;
    token0Amt: bigint;
    token1Amt: bigint;
    user: Address;
    protocol: Address;
};

function getLogPaybackPerfectDebtLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['shares', getU64Decoder()],
            ['token0Amt', getU64Decoder()],
            ['token1Amt', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_PAYBACK_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogPaybackPerfectDebtLiquidity(data: Uint8Array): LogPaybackPerfectDebtLiquidity {
    if (!LOG_PAYBACK_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogPaybackPerfectDebtLiquidity discriminator mismatch');
    }
    const decoded = getLogPaybackPerfectDebtLiquidityDecoder().decode(data);
    return decoded as LogPaybackPerfectDebtLiquidity;
}
