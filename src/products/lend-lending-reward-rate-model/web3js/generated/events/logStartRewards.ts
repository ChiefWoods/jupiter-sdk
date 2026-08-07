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

export const LOG_START_REWARDS_DISCRIMINATOR = new Uint8Array([30, 243, 168, 45, 233, 150, 101, 238]);

export function getLogStartRewardsDiscriminatorBytes(): Uint8Array {
    return LOG_START_REWARDS_DISCRIMINATOR;
}

export type LogStartRewards = { rewardAmount: bigint; duration: bigint; startTime: bigint; mint: Address };

function getLogStartRewardsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['rewardAmount', getU64Decoder()],
            ['duration', getU64Decoder()],
            ['startTime', getU64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_START_REWARDS_DISCRIMINATOR)],
    );
}

export function parseLogStartRewards(data: Uint8Array): LogStartRewards {
    if (!LOG_START_REWARDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGSTARTREWARDS discriminator mismatch');
    }
    const decoded = getLogStartRewardsDecoder().decode(data);
    return decoded as LogStartRewards;
}
