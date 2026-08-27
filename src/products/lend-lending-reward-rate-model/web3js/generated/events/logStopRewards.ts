import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_STOP_REWARDS_DISCRIMINATOR = new Uint8Array([37, 218, 239, 232, 21, 149, 99, 31]);

export function getLogStopRewardsDiscriminatorBytes(): Uint8Array {
    return LOG_STOP_REWARDS_DISCRIMINATOR;
}

export type LogStopRewards = { mint: Address };

function getLogStopRewardsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_STOP_REWARDS_DISCRIMINATOR)],
    );
}

export function parseLogStopRewards(data: Uint8Array): LogStopRewards {
    if (!LOG_STOP_REWARDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogStopRewards discriminator mismatch');
    }
    const decoded = getLogStopRewardsDecoder().decode(data);
    return decoded as LogStopRewards;
}
