import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_LOOKUP_TABLE_DISCRIMINATOR = new Uint8Array([45, 248, 126, 111, 185, 41, 103, 5]);

export function getLogUpdateLookupTableDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_LOOKUP_TABLE_DISCRIMINATOR;
}

export type LogUpdateLookupTable = { lookupTable: Address };

function getLogUpdateLookupTableDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_LOOKUP_TABLE_DISCRIMINATOR)],
    );
}

export function parseLogUpdateLookupTable(data: Uint8Array): LogUpdateLookupTable {
    if (!LOG_UPDATE_LOOKUP_TABLE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATELOOKUPTABLE discriminator mismatch');
    }
    const decoded = getLogUpdateLookupTableDecoder().decode(data);
    return decoded as LogUpdateLookupTable;
}
