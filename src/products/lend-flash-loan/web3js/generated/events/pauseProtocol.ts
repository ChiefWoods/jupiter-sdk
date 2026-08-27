import { getConstantDecoder, getHiddenPrefixDecoder, getStructDecoder } from '@solana/codecs';

export const PAUSE_PROTOCOL_DISCRIMINATOR = new Uint8Array([66, 229, 166, 147, 152, 13, 42, 29]);

export function getPauseProtocolDiscriminatorBytes(): Uint8Array {
    return PAUSE_PROTOCOL_DISCRIMINATOR;
}

export type PauseProtocol = {};

function getPauseProtocolDecoder() {
    return getHiddenPrefixDecoder(getStructDecoder([]), [getConstantDecoder(PAUSE_PROTOCOL_DISCRIMINATOR)]);
}

export function parsePauseProtocol(data: Uint8Array): PauseProtocol {
    if (!PAUSE_PROTOCOL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PauseProtocol discriminator mismatch');
    }
    const decoded = getPauseProtocolDecoder().decode(data);
    return decoded as PauseProtocol;
}
