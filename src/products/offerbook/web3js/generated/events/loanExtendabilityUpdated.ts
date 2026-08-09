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

export const LOAN_EXTENDABILITY_UPDATED_DISCRIMINATOR = new Uint8Array([132, 189, 244, 21, 191, 39, 88, 94]);

export function getLoanExtendabilityUpdatedDiscriminatorBytes(): Uint8Array {
    return LOAN_EXTENDABILITY_UPDATED_DISCRIMINATOR;
}

export type LoanExtendabilityUpdated = { loan: Address; extendable: number; timestamp: bigint };

function getLoanExtendabilityUpdatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['extendable', getU8Decoder()],
            ['timestamp', getU64Decoder()],
        ]),
        [getConstantDecoder(LOAN_EXTENDABILITY_UPDATED_DISCRIMINATOR)],
    );
}

export function parseLoanExtendabilityUpdated(data: Uint8Array): LoanExtendabilityUpdated {
    if (!LOAN_EXTENDABILITY_UPDATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOANEXTENDABILITYUPDATED discriminator mismatch');
    }
    const decoded = getLoanExtendabilityUpdatedDecoder().decode(data);
    return decoded as LoanExtendabilityUpdated;
}
