import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI16Decoder,
    getStructDecoder,
    getU16Decoder,
    getU8Decoder,
} from '@solana/codecs';

export const LOG_UPDATE_CORE_SETTINGS_DISCRIMINATOR = new Uint8Array([233, 65, 32, 7, 230, 115, 122, 197]);

export function getLogUpdateCoreSettingsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_CORE_SETTINGS_DISCRIMINATOR;
}

export type LogUpdateCoreSettings = {
    supplyRateMagnifier: number;
    borrowRateMagnifier: number;
    collateralFactor: number;
    liquidationThreshold: number;
    liquidationMaxLimit: number;
    withdrawGap: number;
    liquidationPenalty: number;
    borrowFee: number;
};

function getLogUpdateCoreSettingsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['supplyRateMagnifier', getI16Decoder()],
            ['borrowRateMagnifier', getI16Decoder()],
            ['collateralFactor', getU16Decoder()],
            ['liquidationThreshold', getU16Decoder()],
            ['liquidationMaxLimit', getU16Decoder()],
            ['withdrawGap', getU16Decoder()],
            ['liquidationPenalty', getU16Decoder()],
            ['borrowFee', getU8Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_CORE_SETTINGS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateCoreSettings(data: Uint8Array): LogUpdateCoreSettings {
    if (!LOG_UPDATE_CORE_SETTINGS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATECORESETTINGS discriminator mismatch');
    }
    const decoded = getLogUpdateCoreSettingsDecoder().decode(data);
    return decoded as LogUpdateCoreSettings;
}
