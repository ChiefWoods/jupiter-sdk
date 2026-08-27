import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_QUEUE_NEXT_REWARDS_DISCRIMINATOR = new Uint8Array([50, 129, 214, 126, 39, 205, 209, 116]);

export function getLogQueueNextRewardsDiscriminatorBytes(): Uint8Array {
    return LOG_QUEUE_NEXT_REWARDS_DISCRIMINATOR;
}

export type LogQueueNextRewards = { rewardAmount: bigint; duration: bigint; mint: Address };

function getLogQueueNextRewardsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['rewardAmount', getU64Decoder()],
            ['duration', getU64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_QUEUE_NEXT_REWARDS_DISCRIMINATOR)],
    );
}

export function parseLogQueueNextRewards(data: Uint8Array): LogQueueNextRewards {
    if (!LOG_QUEUE_NEXT_REWARDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogQueueNextRewards discriminator mismatch');
    }
    const decoded = getLogQueueNextRewardsDecoder().decode(data);
    return decoded as LogQueueNextRewards;
}
