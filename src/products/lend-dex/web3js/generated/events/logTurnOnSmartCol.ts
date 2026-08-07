import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_TURN_ON_SMART_COL_DISCRIMINATOR = new Uint8Array([108, 254, 255, 147, 80, 55, 98, 86]);

export function getLogTurnOnSmartColDiscriminatorBytes(): Uint8Array {
    return LOG_TURN_ON_SMART_COL_DISCRIMINATOR;
}

export type LogTurnOnSmartCol = { dexId: number; token0Amt: bigint };

function getLogTurnOnSmartColDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['token0Amt', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_TURN_ON_SMART_COL_DISCRIMINATOR)],
    );
}

export function parseLogTurnOnSmartCol(data: Uint8Array): LogTurnOnSmartCol {
    if (!LOG_TURN_ON_SMART_COL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGTURNONSMARTCOL discriminator mismatch');
    }
    const decoded = getLogTurnOnSmartColDecoder().decode(data);
    return decoded as LogTurnOnSmartCol;
}
