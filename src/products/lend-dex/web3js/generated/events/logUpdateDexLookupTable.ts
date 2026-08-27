import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_DEX_LOOKUP_TABLE_DISCRIMINATOR = new Uint8Array([135, 31, 232, 96, 2, 64, 116, 229]);

export function getLogUpdateDexLookupTableDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_DEX_LOOKUP_TABLE_DISCRIMINATOR;
}

export type LogUpdateDexLookupTable = { dexId: number; lookupTable: Address };

function getLogUpdateDexLookupTableDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_DEX_LOOKUP_TABLE_DISCRIMINATOR)],
    );
}

export function parseLogUpdateDexLookupTable(data: Uint8Array): LogUpdateDexLookupTable {
    if (!LOG_UPDATE_DEX_LOOKUP_TABLE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateDexLookupTable discriminator mismatch');
    }
    const decoded = getLogUpdateDexLookupTableDecoder().decode(data);
    return decoded as LogUpdateDexLookupTable;
}
