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

export const LOG_DEPOSIT_COL_LIQUIDITY_DISCRIMINATOR = new Uint8Array([162, 105, 100, 76, 89, 95, 69, 189]);

export function getLogDepositColLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_DEPOSIT_COL_LIQUIDITY_DISCRIMINATOR;
}

export type LogDepositColLiquidity = {
    dexId: number;
    amount0: bigint;
    amount1: bigint;
    shares: bigint;
    user: Address;
    protocol: Address;
};

function getLogDepositColLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['amount0', getU64Decoder()],
            ['amount1', getU64Decoder()],
            ['shares', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_DEPOSIT_COL_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogDepositColLiquidity(data: Uint8Array): LogDepositColLiquidity {
    if (!LOG_DEPOSIT_COL_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogDepositColLiquidity discriminator mismatch');
    }
    const decoded = getLogDepositColLiquidityDecoder().decode(data);
    return decoded as LogDepositColLiquidity;
}
