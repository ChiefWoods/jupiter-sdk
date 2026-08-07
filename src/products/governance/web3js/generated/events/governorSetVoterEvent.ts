import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const GOVERNOR_SET_VOTER_DISCRIMINATOR = new Uint8Array([31, 141, 33, 222, 105, 177, 230, 207]);

export function getGovernorSetVoterEventDiscriminatorBytes(): Uint8Array {
    return GOVERNOR_SET_VOTER_DISCRIMINATOR;
}

export type GovernorSetVoter = { governor: Address; prevLocker: Address; newLocker: Address };

function getGovernorSetVoterDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['prevLocker', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['newLocker', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(GOVERNOR_SET_VOTER_DISCRIMINATOR)],
    );
}

export function parseGovernorSetVoter(data: Uint8Array): GovernorSetVoter {
    if (!GOVERNOR_SET_VOTER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('GOVERNORSETVOTER discriminator mismatch');
    }
    const decoded = getGovernorSetVoterDecoder().decode(data);
    return decoded as GovernorSetVoter;
}
