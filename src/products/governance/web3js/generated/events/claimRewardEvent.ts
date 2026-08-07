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

export const CLAIM_REWARD_DISCRIMINATOR = new Uint8Array([207, 16, 14, 170, 176, 71, 40, 53]);

export function getClaimRewardEventDiscriminatorBytes(): Uint8Array {
    return CLAIM_REWARD_DISCRIMINATOR;
}

export type ClaimReward = { governor: Address; voter: Address; proposal: Address; votingReward: bigint };

function getClaimRewardDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['voter', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['votingReward', getU64Decoder()],
        ]),
        [getConstantDecoder(CLAIM_REWARD_DISCRIMINATOR)],
    );
}

export function parseClaimReward(data: Uint8Array): ClaimReward {
    if (!CLAIM_REWARD_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CLAIMREWARD discriminator mismatch');
    }
    const decoded = getClaimRewardDecoder().decode(data);
    return decoded as ClaimReward;
}
