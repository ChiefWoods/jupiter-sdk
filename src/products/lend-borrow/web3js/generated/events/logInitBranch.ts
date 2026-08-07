import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU32Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_BRANCH_DISCRIMINATOR = new Uint8Array([127, 182, 211, 219, 140, 189, 193, 101]);

export function getLogInitBranchDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_BRANCH_DISCRIMINATOR;
}

export type LogInitBranch = { branch: Address; branchId: number };

function getLogInitBranchDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['branch', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['branchId', getU32Decoder()],
        ]),
        [getConstantDecoder(LOG_INIT_BRANCH_DISCRIMINATOR)],
    );
}

export function parseLogInitBranch(data: Uint8Array): LogInitBranch {
    if (!LOG_INIT_BRANCH_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGINITBRANCH discriminator mismatch');
    }
    const decoded = getLogInitBranchDecoder().decode(data);
    return decoded as LogInitBranch;
}
