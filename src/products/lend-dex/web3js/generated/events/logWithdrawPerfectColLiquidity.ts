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

export const LOG_WITHDRAW_PERFECT_COL_LIQUIDITY_DISCRIMINATOR = new Uint8Array([199, 40, 242, 90, 55, 165, 41, 105]);

export function getLogWithdrawPerfectColLiquidityDiscriminatorBytes(): Uint8Array {
    return LOG_WITHDRAW_PERFECT_COL_LIQUIDITY_DISCRIMINATOR;
}

export type LogWithdrawPerfectColLiquidity = {
    dexId: number;
    shares: bigint;
    token0Amt: bigint;
    token1Amt: bigint;
    user: Address;
    protocol: Address;
};

function getLogWithdrawPerfectColLiquidityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['shares', getU64Decoder()],
            ['token0Amt', getU64Decoder()],
            ['token1Amt', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_WITHDRAW_PERFECT_COL_LIQUIDITY_DISCRIMINATOR)],
    );
}

export function parseLogWithdrawPerfectColLiquidity(data: Uint8Array): LogWithdrawPerfectColLiquidity {
    if (!LOG_WITHDRAW_PERFECT_COL_LIQUIDITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGWITHDRAWPERFECTCOLLIQUIDITY discriminator mismatch');
    }
    const decoded = getLogWithdrawPerfectColLiquidityDecoder().decode(data);
    return decoded as LogWithdrawPerfectColLiquidity;
}
