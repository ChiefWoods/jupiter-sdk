import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const REDEEM_STAKE_DISCRIMINATOR = new Uint8Array([0, 241, 84, 141, 139, 170, 218, 110]);

export function getRedeemStakeEventDiscriminatorBytes(): Uint8Array {
    return REDEEM_STAKE_DISCRIMINATOR;
}

export type RedeemStake = {
    custody: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    stakeRewards: bigint;
    custodyTotalStakedAmount: bigint;
    currentStakedAmount: bigint;
    totalStakingRewards: bigint;
    redeemTime: bigint;
};

function getRedeemStakeDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeInfo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeRewards', getU64Decoder()],
            ['custodyTotalStakedAmount', getU64Decoder()],
            ['currentStakedAmount', getU64Decoder()],
            ['totalStakingRewards', getU64Decoder()],
            ['redeemTime', getI64Decoder()],
        ]),
        [getConstantDecoder(REDEEM_STAKE_DISCRIMINATOR)],
    );
}

export function parseRedeemStake(data: Uint8Array): RedeemStake {
    if (!REDEEM_STAKE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('RedeemStake discriminator mismatch');
    }
    const decoded = getRedeemStakeDecoder().decode(data);
    return decoded as RedeemStake;
}
