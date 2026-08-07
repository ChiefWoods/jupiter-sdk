import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';

export const ACTIVATE_PROTOCOL_DISCRIMINATOR = new Uint8Array([70, 178, 173, 151, 180, 166, 68, 102]);

export function getActivateProtocolDiscriminatorBytes(): Uint8Array {
    return ACTIVATE_PROTOCOL_DISCRIMINATOR;
}

export type ActivateProtocol = {};

function getActivateProtocolDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([]), [getConstantDecoder(ACTIVATE_PROTOCOL_DISCRIMINATOR)]);
}

export function parseActivateProtocol(data: Uint8Array): ActivateProtocol {
    if (!ACTIVATE_PROTOCOL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ACTIVATEPROTOCOL discriminator mismatch');
    }
    const decoded = getActivateProtocolDecoder().decode(data);
    return decoded as ActivateProtocol;
}
