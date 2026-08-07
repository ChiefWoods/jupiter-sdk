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

export const LOAN_REPAID_DISCRIMINATOR = new Uint8Array([202, 183, 88, 60, 211, 54, 142, 243]);

export function getLoanRepaidDiscriminatorBytes(): Uint8Array {
    return LOAN_REPAID_DISCRIMINATOR;
}

export type LoanRepaid = { loan: LoanEventV0; pubkey: Address };

function getLoanRepaidDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV0Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_REPAID_DISCRIMINATOR)],
    );
}

export function parseLoanRepaid(data: Uint8Array): LoanRepaid {
    if (!LOAN_REPAID_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOANREPAID discriminator mismatch');
    }
    const decoded = getLoanRepaidDecoder().decode(data);
    return decoded as LoanRepaid;
}
