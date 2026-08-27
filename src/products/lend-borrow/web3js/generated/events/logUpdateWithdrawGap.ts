import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder, getU16Decoder } from '@solana/codecs';

export const LOG_UPDATE_WITHDRAW_GAP_DISCRIMINATOR = new Uint8Array([182, 248, 48, 47, 8, 159, 21, 35]);

export function getLogUpdateWithdrawGapDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_WITHDRAW_GAP_DISCRIMINATOR;
}

export type LogUpdateWithdrawGap = { withdrawGap: number };

function getLogUpdateWithdrawGapDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['withdrawGap', getU16Decoder()]]), [
        getConstantDecoder(LOG_UPDATE_WITHDRAW_GAP_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateWithdrawGap(data: Uint8Array): LogUpdateWithdrawGap {
    if (!LOG_UPDATE_WITHDRAW_GAP_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateWithdrawGap discriminator mismatch');
    }
    const decoded = getLogUpdateWithdrawGapDecoder().decode(data);
    return decoded as LogUpdateWithdrawGap;
}
