import { getU8Codec } from '@solana/codecs';

export enum V11FeedSessionType {
    Regular,
    Extended,
    Overnight,
}

export const v11FeedSessionTypeCodec = getU8Codec();
