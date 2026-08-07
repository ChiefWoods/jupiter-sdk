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

export const GOVERNOR_SET_PARAMS_DISCRIMINATOR = new Uint8Array([169, 129, 187, 152, 130, 17, 81, 157]);

export function getGovernorSetParamsEventDiscriminatorBytes(): Uint8Array {
    return GOVERNOR_SET_PARAMS_DISCRIMINATOR;
}

export type GovernorSetParams = { governor: Address; prevParams: GovernanceParameters; params: GovernanceParameters };

function getGovernorSetParamsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['governor', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['prevParams', getGovernanceParametersDecoder()],
            ['params', getGovernanceParametersDecoder()],
        ]),
        [getConstantDecoder(GOVERNOR_SET_PARAMS_DISCRIMINATOR)],
    );
}

export function parseGovernorSetParams(data: Uint8Array): GovernorSetParams {
    if (!GOVERNOR_SET_PARAMS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('GOVERNORSETPARAMS discriminator mismatch');
    }
    const decoded = getGovernorSetParamsDecoder().decode(data);
    return decoded as GovernorSetParams;
}
