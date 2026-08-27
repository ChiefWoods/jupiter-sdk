import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const LOG_CHAINLINK_DATA_STREAMS_FEED_MARKET_IS_IN_TRANSITION_DISCRIMINATOR = new Uint8Array([
    211, 67, 128, 58, 147, 192, 179, 111,
]);

export function getLogChainlinkDataStreamsFeedMarketIsInTransitionDiscriminatorBytes(): Uint8Array {
    return LOG_CHAINLINK_DATA_STREAMS_FEED_MARKET_IS_IN_TRANSITION_DISCRIMINATOR;
}

export type LogChainlinkDataStreamsFeedMarketIsInTransition = {
    feedId: ReadonlyUint8Array;
    v11TransitionTimestampS: bigint;
};

function getLogChainlinkDataStreamsFeedMarketIsInTransitionDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['feedId', fixDecoderSize(getBytesDecoder(), 32)],
            ['v11TransitionTimestampS', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_CHAINLINK_DATA_STREAMS_FEED_MARKET_IS_IN_TRANSITION_DISCRIMINATOR)],
    );
}

export function parseLogChainlinkDataStreamsFeedMarketIsInTransition(
    data: Uint8Array,
): LogChainlinkDataStreamsFeedMarketIsInTransition {
    if (
        !LOG_CHAINLINK_DATA_STREAMS_FEED_MARKET_IS_IN_TRANSITION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    ) {
        throw new Error('LogChainlinkDataStreamsFeedMarketIsInTransition discriminator mismatch');
    }
    const decoded = getLogChainlinkDataStreamsFeedMarketIsInTransitionDecoder().decode(data);
    return decoded as LogChainlinkDataStreamsFeedMarketIsInTransition;
}
