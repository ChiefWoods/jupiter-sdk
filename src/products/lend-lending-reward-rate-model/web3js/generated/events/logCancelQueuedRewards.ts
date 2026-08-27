import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_CANCEL_QUEUED_REWARDS_DISCRIMINATOR = new Uint8Array([177, 173, 63, 139, 228, 173, 187, 204]);

export function getLogCancelQueuedRewardsDiscriminatorBytes(): Uint8Array {
    return LOG_CANCEL_QUEUED_REWARDS_DISCRIMINATOR;
}

export type LogCancelQueuedRewards = { mint: Address };

function getLogCancelQueuedRewardsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_CANCEL_QUEUED_REWARDS_DISCRIMINATOR)],
    );
}

export function parseLogCancelQueuedRewards(data: Uint8Array): LogCancelQueuedRewards {
    if (!LOG_CANCEL_QUEUED_REWARDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogCancelQueuedRewards discriminator mismatch');
    }
    const decoded = getLogCancelQueuedRewardsDecoder().decode(data);
    return decoded as LogCancelQueuedRewards;
}
