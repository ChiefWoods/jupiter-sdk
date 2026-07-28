import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** Governance parameters. */
export type VotingReward = {
    /** Reward mint */
    rewardMint: Address;
    /** Reward vault */
    rewardVault: Address;
    /** Total reward per proposal */
    rewardPerProposal: bigint;
};

export type VotingRewardArgs = {
    /** Reward mint */
    rewardMint: Address;
    /** Reward vault */
    rewardVault: Address;
    /** Total reward per proposal */
    rewardPerProposal: number | bigint;
};

export function getVotingRewardEncoder(): Encoder<VotingRewardArgs> {
    return getStructEncoder([
        ['rewardMint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['rewardVault', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['rewardPerProposal', getU64Encoder()],
    ]);
}

export function getVotingRewardDecoder(): Decoder<VotingReward> {
    return getStructDecoder([
        ['rewardMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['rewardVault', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['rewardPerProposal', getU64Decoder()],
    ]);
}

export function getVotingRewardCodec(): Codec<VotingRewardArgs, VotingReward> {
    return combineCodec(getVotingRewardEncoder(), getVotingRewardDecoder());
}
