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

export const LOG_TRANSITIONED_TO_NEXT_REWARDS_DISCRIMINATOR = new Uint8Array([177, 232, 239, 222, 224, 61, 9, 101]);

export function getLogTransitionedToNextRewardsDiscriminatorBytes(): Uint8Array {
    return LOG_TRANSITIONED_TO_NEXT_REWARDS_DISCRIMINATOR;
}

export type LogTransitionedToNextRewards = { startTime: bigint; endTime: bigint; mint: Address };

function getLogTransitionedToNextRewardsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['startTime', getU64Decoder()],
            ['endTime', getU64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_TRANSITIONED_TO_NEXT_REWARDS_DISCRIMINATOR)],
    );
}

export function parseLogTransitionedToNextRewards(data: Uint8Array): LogTransitionedToNextRewards {
    if (!LOG_TRANSITIONED_TO_NEXT_REWARDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogTransitionedToNextRewards discriminator mismatch');
    }
    const decoded = getLogTransitionedToNextRewardsDecoder().decode(data);
    return decoded as LogTransitionedToNextRewards;
}
