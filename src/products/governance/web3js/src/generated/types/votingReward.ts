import { Address } from '@solana/web3.js';
import { fixCodecSize, getBytesCodec, getStructCodec, getU64Codec, transformCodec } from '@solana/codecs';

export interface VotingReward {
    rewardMint: Address;
    rewardVault: Address;
    rewardPerProposal: bigint;
}

export const votingRewardCodec = getStructCodec([
    [
        'rewardMint',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'rewardVault',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['rewardPerProposal', getU64Codec()],
]);
