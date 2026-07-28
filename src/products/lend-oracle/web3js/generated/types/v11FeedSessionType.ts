import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

/**
 * Trading-session scope for a V11 (24/5 US Equities) feed.
 *
 * Chainlink publishes a `market_status` field in every v11 report that indicates which
 * trading phase is currently active. This is done here because even when market is not
 * in session chainlink feeds can public other sessions data.
 * This enum captures which phases are valid for a given feed so that reports arriving
 * with an unsupported status can be rejected early rather than silently accepted.
 *
 * For non-V11 feed entries (`report_type != RWAAdvanced`) this field is ignored.
 */
export enum V11FeedSessionType {
    Regular,
    Extended,
    Overnight,
}

export type V11FeedSessionTypeArgs = V11FeedSessionType;

export function getV11FeedSessionTypeEncoder(): Encoder<V11FeedSessionTypeArgs> {
    return getEnumEncoder(V11FeedSessionType);
}

export function getV11FeedSessionTypeDecoder(): Decoder<V11FeedSessionType> {
    return getEnumDecoder(V11FeedSessionType);
}

export function getV11FeedSessionTypeCodec(): Codec<V11FeedSessionTypeArgs, V11FeedSessionType> {
    return combineCodec(getV11FeedSessionTypeEncoder(), getV11FeedSessionTypeDecoder());
}
