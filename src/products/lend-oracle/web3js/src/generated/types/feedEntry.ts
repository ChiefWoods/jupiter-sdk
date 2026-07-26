import { ChainlinkReportType, chainlinkReportTypeCodec } from '../types/chainlinkReportType';
import { V11FeedSessionType, v11FeedSessionTypeCodec } from '../types/v11FeedSessionType';
import { fixCodecSize, getBytesCodec, getStructCodec } from '@solana/codecs';

export interface FeedEntry {
    feedId: Uint8Array;
    reportType: ChainlinkReportType;
    v11SessionType: V11FeedSessionType;
}

export const feedEntryCodec = getStructCodec([
    ['feedId', fixCodecSize(getBytesCodec(), 32)],
    ['reportType', chainlinkReportTypeCodec],
    ['v11SessionType', v11FeedSessionTypeCodec],
]);
