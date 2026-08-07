import { getAddressU8Decoder, type AddressU8 } from '../types/addressU8';
import { getArrayDecoder, getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';

export const LOG_UPDATE_USER_CLASS_DISCRIMINATOR = new Uint8Array([185, 193, 106, 248, 11, 53, 0, 136]);

export function getLogUpdateUserClassDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_USER_CLASS_DISCRIMINATOR;
}

export type LogUpdateUserClass = { userClass: Array<AddressU8> };

function getLogUpdateUserClassDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([['userClass', getArrayDecoder(getAddressU8Decoder())]]), [
        getConstantDecoder(LOG_UPDATE_USER_CLASS_DISCRIMINATOR),
    ]);
}

export function parseLogUpdateUserClass(data: Uint8Array): LogUpdateUserClass {
    if (!LOG_UPDATE_USER_CLASS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEUSERCLASS discriminator mismatch');
    }
    const decoded = getLogUpdateUserClassDecoder().decode(data);
    return decoded as LogUpdateUserClass;
}
