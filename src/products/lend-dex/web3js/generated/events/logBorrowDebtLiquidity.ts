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

export const LOG_BORROW_DEBT_LIQUIDITY_DISCRIMINATOR = new Uint8Array([70, 124, 172, 119, 252, 91, 62, 4]);

export function getLogBorrowDebtLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_BORROW_DEBT_LIQUIDITY_DISCRIMINATOR;
}

export type LogBorrowDebtLiquidity = {
    dexId: number;
    amount0: bigint;
    amount1: bigint;
    shares: bigint;
    user: Address;
    protocol: Address;
};

function getLogBorrowDebtLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['amount0', getU64Decoder()],
            ['amount1', getU64Decoder()],
            ['shares', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_BORROW_DEBT_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogBorrowDebtLiquidity(data: Uint8Array): LogBorrowDebtLiquidity {
    if (!LOG_BORROW_DEBT_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGBORROWDEBTLIQUIDITY discriminator mismatch');
    }
    const decoded = getLogBorrowDebtLiquidityDecoder().decode(data);
    return decoded as LogBorrowDebtLiquidity;
}
