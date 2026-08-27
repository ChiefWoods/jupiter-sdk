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

export const GOVERNOR_SET_VOTING_REWARD_DISCRIMINATOR = new Uint8Array([74, 82, 223, 19, 41, 16, 148, 200]);

export function getGovernorSetVotingRewardDiscriminatorBytes(): Uint8Array {
    return GOVERNOR_SET_VOTING_REWARD_DISCRIMINATOR;
}

export type GovernorSetVotingReward = { governor: Address; rewardMint: Address; rewardPerProposal: bigint };

function getGovernorSetVotingRewardDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['rewardMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['rewardPerProposal', getU64Decoder()],
        ]),
        [getConstantDecoder(GOVERNOR_SET_VOTING_REWARD_DISCRIMINATOR)],
    );
}

export function parseGovernorSetVotingReward(data: Uint8Array): GovernorSetVotingReward {
    if (!GOVERNOR_SET_VOTING_REWARD_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('GovernorSetVotingReward discriminator mismatch');
    }
    const decoded = getGovernorSetVotingRewardDecoder().decode(data);
    return decoded as GovernorSetVotingReward;
}
