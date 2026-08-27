import { getAddressBoolDecoder, type AddressBool } from '../types/addressBool';
import { getArrayDecoder, getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';

export const LOG_UPDATE_AUTHS_DISCRIMINATOR = new Uint8Array([88, 80, 109, 48, 111, 203, 76, 251]);

export function getLogUpdateAuthsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_AUTHS_DISCRIMINATOR;
}

export type LogUpdateAuths = { authStatus: Array<AddressBool> };

function getLogUpdateAuthsDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['authStatus', getArrayDecoder(getAddressBoolDecoder())]]), [
        getConstantDecoder(LOG_UPDATE_AUTHS_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateAuths(data: Uint8Array): LogUpdateAuths {
    if (!LOG_UPDATE_AUTHS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateAuths discriminator mismatch');
    }
    const decoded = getLogUpdateAuthsDecoder().decode(data);
    return decoded as LogUpdateAuths;
}
