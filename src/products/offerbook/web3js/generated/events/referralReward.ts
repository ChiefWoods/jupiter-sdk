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
import { getReferralTypeDecoder, type ReferralType } from '../types/referralType';

export const REFERRAL_REWARD_DISCRIMINATOR = new Uint8Array([30, 218, 84, 175, 188, 85, 219, 99]);

export function getReferralRewardDiscriminatorBytes(): Uint8Array {
    return REFERRAL_REWARD_DISCRIMINATOR;
}

export type ReferralReward = {
    referrer: Address;
    referee: Address;
    mint: Address;
    amount: bigint;
    timestamp: bigint;
    referralType: ReferralType;
};

function getReferralRewardDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['referrer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['referee', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['timestamp', getU64Decoder()],
            ['referralType', getReferralTypeDecoder()],
        ]),
        [getConstantDecoder(REFERRAL_REWARD_DISCRIMINATOR)],
    );
}

export function parseReferralReward(data: Uint8Array): ReferralReward {
    if (!REFERRAL_REWARD_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('REFERRALREWARD discriminator mismatch');
    }
    const decoded = getReferralRewardDecoder().decode(data);
    return decoded as ReferralReward;
}
