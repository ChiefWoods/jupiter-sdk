import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UPDATE_LIQUIDATION_PENALTY_DISCRIMINATOR = new Uint8Array([42, 132, 67, 48, 209, 133, 77, 83]);

export function getLogUpdateLiquidationPenaltyDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_LIQUIDATION_PENALTY_DISCRIMINATOR;
}

export type LogUpdateLiquidationPenalty = { liquidationPenalty: number };

function getLogUpdateLiquidationPenaltyDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['liquidationPenalty', getU16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_LIQUIDATION_PENALTY_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateLiquidationPenalty(data: Uint8Array): LogUpdateLiquidationPenalty {
    if (!LOG_UPDATE_LIQUIDATION_PENALTY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATELIQUIDATIONPENALTY discriminator mismatch');
    }
    const decoded = getLogUpdateLiquidationPenaltyDecoder().decode(data);
    return decoded as LogUpdateLiquidationPenalty;
}
