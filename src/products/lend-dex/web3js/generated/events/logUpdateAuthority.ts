import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_AUTHORITY_DISCRIMINATOR = new Uint8Array([150, 152, 157, 143, 6, 135, 193, 101]);

export function getLogUpdateAuthorityDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_AUTHORITY_DISCRIMINATOR;
}

export type LogUpdateAuthority = { newAuthority: Address };

function getLogUpdateAuthorityDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['newAuthority', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_AUTHORITY_DISCRIMINATOR)],
    );
}

export function parseLogUpdateAuthority(data: Uint8Array): LogUpdateAuthority {
    if (!LOG_UPDATE_AUTHORITY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateAuthority discriminator mismatch');
    }
    const decoded = getLogUpdateAuthorityDecoder().decode(data);
    return decoded as LogUpdateAuthority;
}
