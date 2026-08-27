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

export const LOG_DEPOSIT_PERFECT_COL_LIQUIDITY_DISCRIMINATOR = new Uint8Array([33, 91, 169, 231, 163, 83, 37, 254]);

export function getLogDepositPerfectColLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_DEPOSIT_PERFECT_COL_LIQUIDITY_DISCRIMINATOR;
}

export type LogDepositPerfectColLiquidity = {
    dexId: number;
    shares: bigint;
    token0Amt: bigint;
    token1Amt: bigint;
    user: Address;
    protocol: Address;
};

function getLogDepositPerfectColLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['shares', getU64Decoder()],
            ['token0Amt', getU64Decoder()],
            ['token1Amt', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_DEPOSIT_PERFECT_COL_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogDepositPerfectColLiquidity(data: Uint8Array): LogDepositPerfectColLiquidity {
    if (!LOG_DEPOSIT_PERFECT_COL_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogDepositPerfectColLiquidity discriminator mismatch');
    }
    const decoded = getLogDepositPerfectColLiquidityDecoder().decode(data);
    return decoded as LogDepositPerfectColLiquidity;
}
