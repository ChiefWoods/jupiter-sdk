import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_REWARDS_DISCRIMINATOR = new Uint8Array([37, 13, 111, 186, 47, 245, 162, 121]);

export function getLogUpdateRewardsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_REWARDS_DISCRIMINATOR;
}

export type LogUpdateRewards = { rewardsRateModel: Address };

function getLogUpdateRewardsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['rewardsRateModel', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_REWARDS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRewards(data: Uint8Array): LogUpdateRewards {
    if (!LOG_UPDATE_REWARDS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEREWARDS discriminator mismatch');
    }
    const decoded = getLogUpdateRewardsDecoder().decode(data);
    return decoded as LogUpdateRewards;
}
