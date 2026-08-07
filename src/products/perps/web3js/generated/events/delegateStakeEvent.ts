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

export const DELEGATE_STAKE_DISCRIMINATOR = new Uint8Array([85, 135, 75, 222, 168, 133, 159, 212]);

export function getDelegateStakeEventDiscriminatorBytes(): Uint8Array {
    return DELEGATE_STAKE_DISCRIMINATOR;
}

export type DelegateStake = {
    custody: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    custodyTotalStakedAmount: bigint;
    stakeAmount: bigint;
    validatorVoteAccount: Address;
    delegateTime: bigint;
};

function getDelegateStakeDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['stakeInfo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['custodyTotalStakedAmount', getU64Decoder()],
            ['stakeAmount', getU64Decoder()],
            [
                'validatorVoteAccount',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['delegateTime', getI64Decoder()],
        ]),
        [getConstantDecoder(DELEGATE_STAKE_DISCRIMINATOR)],
    );
}

export function parseDelegateStake(data: Uint8Array): DelegateStake {
    if (!DELEGATE_STAKE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('DELEGATESTAKE discriminator mismatch');
    }
    const decoded = getDelegateStakeDecoder().decode(data);
    return decoded as DelegateStake;
}
