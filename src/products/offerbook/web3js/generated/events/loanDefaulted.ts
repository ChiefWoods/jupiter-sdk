import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getLoanEventV0Decoder, type LoanEventV0 } from '../types/loanEventV0';

export const LOAN_DEFAULTED_DISCRIMINATOR = new Uint8Array([194, 98, 51, 88, 228, 118, 173, 46]);

export function getLoanDefaultedDiscriminatorBytes(): Uint8Array {
    return LOAN_DEFAULTED_DISCRIMINATOR;
}

export type LoanDefaulted = { loan: LoanEventV0; pubkey: Address };

function getLoanDefaultedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV0Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_DEFAULTED_DISCRIMINATOR)],
    );
}

export function parseLoanDefaulted(data: Uint8Array): LoanDefaulted {
    if (!LOAN_DEFAULTED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOANDEFAULTED discriminator mismatch');
    }
    const decoded = getLoanDefaultedDecoder().decode(data);
    return decoded as LoanDefaulted;
}
