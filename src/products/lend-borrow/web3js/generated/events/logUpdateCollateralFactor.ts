import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UPDATE_COLLATERAL_FACTOR_DISCRIMINATOR = new Uint8Array([142, 89, 0, 231, 164, 164, 230, 82]);

export function getLogUpdateCollateralFactorDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_COLLATERAL_FACTOR_DISCRIMINATOR;
}

export type LogUpdateCollateralFactor = { collateralFactor: number };

function getLogUpdateCollateralFactorDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['collateralFactor', getU16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_COLLATERAL_FACTOR_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateCollateralFactor(data: Uint8Array): LogUpdateCollateralFactor {
    if (!LOG_UPDATE_COLLATERAL_FACTOR_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATECOLLATERALFACTOR discriminator mismatch');
    }
    const decoded = getLogUpdateCollateralFactorDecoder().decode(data);
    return decoded as LogUpdateCollateralFactor;
}
