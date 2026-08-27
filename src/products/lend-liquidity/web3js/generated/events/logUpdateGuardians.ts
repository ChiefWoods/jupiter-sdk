import { getAddressBoolDecoder, type AddressBool } from '../types/addressBool';
import { getArrayDecoder, getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';

export const LOG_UPDATE_GUARDIANS_DISCRIMINATOR = new Uint8Array([231, 28, 191, 51, 53, 140, 79, 142]);

export function getLogUpdateGuardiansDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_GUARDIANS_DISCRIMINATOR;
}

export type LogUpdateGuardians = { guardianStatus: Array<AddressBool> };

function getLogUpdateGuardiansDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['guardianStatus', getArrayDecoder(getAddressBoolDecoder())]]), [
        getConstantDecoder(LOG_UPDATE_GUARDIANS_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateGuardians(data: Uint8Array): LogUpdateGuardians {
    if (!LOG_UPDATE_GUARDIANS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateGuardians discriminator mismatch');
    }
    const decoded = getLogUpdateGuardiansDecoder().decode(data);
    return decoded as LogUpdateGuardians;
}
