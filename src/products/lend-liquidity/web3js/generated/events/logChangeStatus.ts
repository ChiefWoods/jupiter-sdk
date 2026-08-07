import { getBooleanDecoder, getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';

export const LOG_CHANGE_STATUS_DISCRIMINATOR = new Uint8Array([89, 77, 37, 172, 141, 31, 74, 42]);

export function getLogChangeStatusDiscriminatorBytes(): Uint8Array {
    return LOG_CHANGE_STATUS_DISCRIMINATOR;
}

export type LogChangeStatus = { newStatus: boolean };

function getLogChangeStatusDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['newStatus', getBooleanDecoder()]]), [
        getConstantDecoder(LOG_CHANGE_STATUS_DISCRIMINATOR),
    ]);
}

export function parseLogChangeStatus(data: Uint8Array): LogChangeStatus {
    if (!LOG_CHANGE_STATUS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGCHANGESTATUS discriminator mismatch');
    }
    const decoded = getLogChangeStatusDecoder().decode(data);
    return decoded as LogChangeStatus;
}
