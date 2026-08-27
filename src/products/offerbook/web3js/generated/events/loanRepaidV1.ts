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

export const LOAN_REPAID_V1_DISCRIMINATOR = new Uint8Array([68, 118, 134, 24, 25, 250, 199, 187]);

export function getLoanRepaidV1DiscriminatorBytes(): Uint8Array {
    return LOAN_REPAID_V1_DISCRIMINATOR;
}

export type LoanRepaidV1 = { loan: LoanEventV1; pubkey: Address };

function getLoanRepaidV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_REPAID_V1_DISCRIMINATOR)],
    );
}

export function parseLoanRepaidV1(data: Uint8Array): LoanRepaidV1 {
    if (!LOAN_REPAID_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LoanRepaidV1 discriminator mismatch');
    }
    const decoded = getLoanRepaidV1Decoder().decode(data);
    return decoded as LoanRepaidV1;
}
