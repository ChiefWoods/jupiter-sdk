import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getGovernanceParametersDecoder, type GovernanceParameters } from '../types/governanceParameters';

export const GOVERNOR_CREATE_DISCRIMINATOR = new Uint8Array([117, 24, 15, 85, 39, 58, 62, 23]);

export function getGovernorCreateEventDiscriminatorBytes(): Uint8Array {
    return GOVERNOR_CREATE_DISCRIMINATOR;
}

export type GovernorCreate = {
    governor: Address;
    locker: Address;
    smartWallet: Address;
    parameters: GovernanceParameters;
};

function getGovernorCreateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['locker', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['smartWallet', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['parameters', getGovernanceParametersDecoder()],
        ]),
        [getConstantDecoder(GOVERNOR_CREATE_DISCRIMINATOR)],
    );
}

export function parseGovernorCreate(data: Uint8Array): GovernorCreate {
    if (!GOVERNOR_CREATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('GOVERNORCREATE discriminator mismatch');
    }
    const decoded = getGovernorCreateDecoder().decode(data);
    return decoded as GovernorCreate;
}
