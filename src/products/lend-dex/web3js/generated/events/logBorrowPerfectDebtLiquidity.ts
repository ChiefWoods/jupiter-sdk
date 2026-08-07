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

export const LOG_BORROW_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR = new Uint8Array([164, 250, 16, 192, 152, 3, 238, 107]);

export function getLogBorrowPerfectDebtLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_BORROW_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR;
}

export type LogBorrowPerfectDebtLiquidity = {
    dexId: number;
    shares: bigint;
    token0Amt: bigint;
    token1Amt: bigint;
    user: Address;
    protocol: Address;
};

function getLogBorrowPerfectDebtLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['shares', getU64Decoder()],
            ['token0Amt', getU64Decoder()],
            ['token1Amt', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_BORROW_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogBorrowPerfectDebtLiquidity(data: Uint8Array): LogBorrowPerfectDebtLiquidity {
    if (!LOG_BORROW_PERFECT_DEBT_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGBORROWPERFECTDEBTLIQUIDITY discriminator mismatch');
    }
    const decoded = getLogBorrowPerfectDebtLiquidityDecoder().decode(data);
    return decoded as LogBorrowPerfectDebtLiquidity;
}
