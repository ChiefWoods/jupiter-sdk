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
import { getFeedEntryDecoder, type FeedEntry } from '../types/feedEntry';

export const LOG_UPDATE_CACHE_FEEDS_DISCRIMINATOR = new Uint8Array([75, 155, 134, 56, 17, 94, 235, 191]);

export function getLogUpdateCacheFeedsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_CACHE_FEEDS_DISCRIMINATOR;
}

export type LogUpdateCacheFeeds = { chainlinkDataStreamsCache: Address; feeds: Array<FeedEntry> };

function getLogUpdateCacheFeedsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            [
                'chainlinkDataStreamsCache',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['feeds', getArrayDecoder(getFeedEntryDecoder())],
        ]),
        [getConstantDecoder(LOG_UPDATE_CACHE_FEEDS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateCacheFeeds(data: Uint8Array): LogUpdateCacheFeeds {
    if (!LOG_UPDATE_CACHE_FEEDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateCacheFeeds discriminator mismatch');
    }
    const decoded = getLogUpdateCacheFeedsDecoder().decode(data);
    return decoded as LogUpdateCacheFeeds;
}
