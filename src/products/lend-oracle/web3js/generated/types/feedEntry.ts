import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getChainlinkReportTypeDecoder,
    getChainlinkReportTypeEncoder,
    type ChainlinkReportType,
    type ChainlinkReportTypeArgs,
} from '../types/chainlinkReportType';
import {
    getV11FeedSessionTypeDecoder,
    getV11FeedSessionTypeEncoder,
    type V11FeedSessionType,
    type V11FeedSessionTypeArgs,
} from '../types/v11FeedSessionType';

/**
 * One entry in the feed map: a 32-byte Chainlink feed ID paired with its report schema
 * type and, for V11 feeds, the set of trading sessions the feed supports.
 */
export type FeedEntry = {
    feedId: ReadonlyUint8Array;
    reportType: ChainlinkReportType;
    v11SessionType: V11FeedSessionType;
};

export type FeedEntryArgs = {
    feedId: ReadonlyUint8Array;
    reportType: ChainlinkReportTypeArgs;
    v11SessionType: V11FeedSessionTypeArgs;
};

export function getFeedEntryEncoder(): Encoder<FeedEntryArgs> {
    return getStructEncoder([
        ['feedId', fixEncoderSize(getBytesEncoder(), 32)],
        ['reportType', getChainlinkReportTypeEncoder()],
        ['v11SessionType', getV11FeedSessionTypeEncoder()],
    ]);
}

export function getFeedEntryDecoder(): Decoder<FeedEntry> {
    return getStructDecoder([
        ['feedId', fixDecoderSize(getBytesDecoder(), 32)],
        ['reportType', getChainlinkReportTypeDecoder()],
        ['v11SessionType', getV11FeedSessionTypeDecoder()],
    ]);
}

export function getFeedEntryCodec(): Codec<FeedEntryArgs, FeedEntry> {
    return combineCodec(getFeedEntryEncoder(), getFeedEntryDecoder());
}
