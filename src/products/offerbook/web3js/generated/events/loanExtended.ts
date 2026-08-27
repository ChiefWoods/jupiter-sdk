import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getLoanEventV1Decoder, type LoanEventV1 } from '../types/loanEventV1';

export const LOAN_EXTENDED_DISCRIMINATOR = new Uint8Array([146, 18, 190, 31, 50, 17, 133, 1]);

export function getLoanExtendedDiscriminatorBytes(): Uint8Array {
    return LOAN_EXTENDED_DISCRIMINATOR;
}

export type LoanExtended = { loan: LoanEventV1; pubkey: Address };

function getLoanExtendedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_EXTENDED_DISCRIMINATOR)],
    );
}

export function parseLoanExtended(data: Uint8Array): LoanExtended {
    if (!LOAN_EXTENDED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LoanExtended discriminator mismatch');
    }
    const decoded = getLoanExtendedDecoder().decode(data);
    return decoded as LoanExtended;
}
