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

export const WITHDRAW_STAKE_DISCRIMINATOR = new Uint8Array([47, 85, 239, 214, 207, 29, 151, 88]);

export function getWithdrawStakeEventDiscriminatorBytes(): Uint8Array {
    return WITHDRAW_STAKE_DISCRIMINATOR;
}

export type WithdrawStake = {
    custody: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    stakeRewards: bigint;
    custodyTotalStakedAmount: bigint;
    totalStakingRewards: bigint;
    withdrawAmount: bigint;
    withdrawTime: bigint;
};

function getWithdrawStakeDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeInfo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeRewards', getU64Decoder()],
            ['custodyTotalStakedAmount', getU64Decoder()],
            ['totalStakingRewards', getU64Decoder()],
            ['withdrawAmount', getU64Decoder()],
            ['withdrawTime', getI64Decoder()],
        ]),
        [getConstantDecoder(WITHDRAW_STAKE_DISCRIMINATOR)],
    );
}

export function parseWithdrawStake(data: Uint8Array): WithdrawStake {
    if (!WITHDRAW_STAKE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('WITHDRAWSTAKE discriminator mismatch');
    }
    const decoded = getWithdrawStakeDecoder().decode(data);
    return decoded as WithdrawStake;
}
