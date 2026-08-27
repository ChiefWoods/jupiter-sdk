import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getArrayDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getAddressBoolDecoder, type AddressBool } from '../types/addressBool';

export const LOG_UPDATE_CACHE_KEEPERS_DISCRIMINATOR = new Uint8Array([33, 129, 191, 130, 117, 119, 198, 235]);

export function getLogUpdateCacheKeepersDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_CACHE_KEEPERS_DISCRIMINATOR;
}

export type LogUpdateCacheKeepers = { chainlinkDataStreamsCache: Address; keeperStatus: Array<AddressBool> };

function getLogUpdateCacheKeepersDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            [
                'chainlinkDataStreamsCache',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['keeperStatus', getArrayDecoder(getAddressBoolDecoder())],
        ]),
        [getConstantDecoder(LOG_UPDATE_CACHE_KEEPERS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateCacheKeepers(data: Uint8Array): LogUpdateCacheKeepers {
    if (!LOG_UPDATE_CACHE_KEEPERS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateCacheKeepers discriminator mismatch');
    }
    const decoded = getLogUpdateCacheKeepersDecoder().decode(data);
    return decoded as LogUpdateCacheKeepers;
}
