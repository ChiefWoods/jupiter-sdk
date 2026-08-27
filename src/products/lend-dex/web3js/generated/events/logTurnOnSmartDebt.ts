import {
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
} from '@solana/codecs';

export const LOG_TURN_ON_SMART_DEBT_DISCRIMINATOR = new Uint8Array([23, 36, 134, 104, 91, 138, 126, 124]);

export function getLogTurnOnSmartDebtDiscriminatorBytes(): Uint8Array {
    return LOG_TURN_ON_SMART_DEBT_DISCRIMINATOR;
}

export type LogTurnOnSmartDebt = { dexId: number; token0Amt: bigint };

function getLogTurnOnSmartDebtDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['token0Amt', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_TURN_ON_SMART_DEBT_DISCRIMINATOR)],
    );
}

export function parseLogTurnOnSmartDebt(data: Uint8Array): LogTurnOnSmartDebt {
    if (!LOG_TURN_ON_SMART_DEBT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogTurnOnSmartDebt discriminator mismatch');
    }
    const decoded = getLogTurnOnSmartDebtDecoder().decode(data);
    return decoded as LogTurnOnSmartDebt;
}
