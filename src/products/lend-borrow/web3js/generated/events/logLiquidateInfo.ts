import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI32Decoder,
    getStructDecoder,
    getU16Decoder,
} from '@solana/codecs';

export const LOG_LIQUIDATE_INFO_DISCRIMINATOR = new Uint8Array([169, 150, 46, 42, 178, 89, 98, 83]);

export function getLogLiquidateInfoDiscriminatorBytes(): Uint8Array {
    return LOG_LIQUIDATE_INFO_DISCRIMINATOR;
}

export type LogLiquidateInfo = { vaultId: number; startTick: number; endTick: number };

function getLogLiquidateInfoDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vaultId', getU16Decoder()],
            ['startTick', getI32Decoder()],
            ['endTick', getI32Decoder()],
        ]),
        [getConstantDecoder(LOG_LIQUIDATE_INFO_DISCRIMINATOR)],
    );
}

export function parseLogLiquidateInfo(data: Uint8Array): LogLiquidateInfo {
    if (!LOG_LIQUIDATE_INFO_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogLiquidateInfo discriminator mismatch');
    }
    const decoded = getLogLiquidateInfoDecoder().decode(data);
    return decoded as LogLiquidateInfo;
}
