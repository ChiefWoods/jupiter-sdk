import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_LIQUIDATION_ROUNDING_DIFF_DISCRIMINATOR = new Uint8Array([35, 189, 179, 90, 218, 51, 104, 128]);

export function getLogLiquidationRoundingDiffDiscriminatorBytes(): Uint8Array {
    return LOG_LIQUIDATION_ROUNDING_DIFF_DISCRIMINATOR;
}

export type LogLiquidationRoundingDiff = { vaultId: number; actualDebtAmt: bigint; debtAmount: bigint; diff: bigint };

function getLogLiquidationRoundingDiffDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vaultId', getU16Decoder()],
            ['actualDebtAmt', getU64Decoder()],
            ['debtAmount', getU64Decoder()],
            ['diff', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_LIQUIDATION_ROUNDING_DIFF_DISCRIMINATOR)],
    );
}

export function parseLogLiquidationRoundingDiff(data: Uint8Array): LogLiquidationRoundingDiff {
    if (!LOG_LIQUIDATION_ROUNDING_DIFF_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogLiquidationRoundingDiff discriminator mismatch');
    }
    const decoded = getLogLiquidationRoundingDiffDecoder().decode(data);
    return decoded as LogLiquidationRoundingDiff;
}
