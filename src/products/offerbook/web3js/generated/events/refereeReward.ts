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

export const REFEREE_REWARD_DISCRIMINATOR = new Uint8Array([187, 218, 102, 136, 212, 206, 49, 127]);

export function getRefereeRewardDiscriminatorBytes(): Uint8Array {
    return REFEREE_REWARD_DISCRIMINATOR;
}

export type RefereeReward = { referee: Address; mint: Address; amount: bigint; timestamp: bigint };

function getRefereeRewardDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['referee', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['timestamp', getU64Decoder()],
        ]),
        [getConstantDecoder(REFEREE_REWARD_DISCRIMINATOR)],
    );
}

export function parseRefereeReward(data: Uint8Array): RefereeReward {
    if (!REFEREE_REWARD_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('RefereeReward discriminator mismatch');
    }
    const decoded = getRefereeRewardDecoder().decode(data);
    return decoded as RefereeReward;
}
