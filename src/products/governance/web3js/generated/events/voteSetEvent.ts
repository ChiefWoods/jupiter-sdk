import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    getU8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const VOTE_SET_DISCRIMINATOR = new Uint8Array([175, 119, 30, 108, 176, 233, 151, 252]);

export function getVoteSetEventDiscriminatorBytes(): Uint8Array {
    return VOTE_SET_DISCRIMINATOR;
}

export type VoteSet = {
    governor: Address;
    proposal: Address;
    voter: Address;
    vote: Address;
    side: number;
    votingPower: bigint;
};

function getVoteSetDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['proposal', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['voter', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['vote', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['side', getU8Decoder()],
            ['votingPower', getU64Decoder()],
        ]),
        [getConstantDecoder(VOTE_SET_DISCRIMINATOR)],
    );
}

export function parseVoteSet(data: Uint8Array): VoteSet {
    if (!VOTE_SET_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VoteSet discriminator mismatch');
    }
    const decoded = getVoteSetDecoder().decode(data);
    return decoded as VoteSet;
}
