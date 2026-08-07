import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_CHAINLINK_DATA_STREAMS_FEED_SUSPENDED_DISCRIMINATOR = new Uint8Array([
    63, 149, 247, 255, 189, 80, 154, 253,
]);

export function getLogChainlinkDataStreamsFeedSuspendedDiscriminatorBytes(): Uint8Array {
    return LOG_CHAINLINK_DATA_STREAMS_FEED_SUSPENDED_DISCRIMINATOR;
}

export type LogChainlinkDataStreamsFeedSuspended = {
    chainlinkDataStreamsCache: Address;
    keeper: Address;
    xstocksSuspended: boolean;
};

function getLogChainlinkDataStreamsFeedSuspendedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            [
                'chainlinkDataStreamsCache',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['keeper', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['xstocksSuspended', getBooleanDecoder()],
        ]),
        [getConstantDecoder(LOG_CHAINLINK_DATA_STREAMS_FEED_SUSPENDED_DISCRIMINATOR)],
    );
}

export function parseLogChainlinkDataStreamsFeedSuspended(data: Uint8Array): LogChainlinkDataStreamsFeedSuspended {
    if (!LOG_CHAINLINK_DATA_STREAMS_FEED_SUSPENDED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGCHAINLINKDATASTREAMSFEEDSUSPENDED discriminator mismatch');
    }
    const decoded = getLogChainlinkDataStreamsFeedSuspendedDecoder().decode(data);
    return decoded as LogChainlinkDataStreamsFeedSuspended;
}
