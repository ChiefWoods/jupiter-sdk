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

export const LOAN_CREATED_V1_DISCRIMINATOR = new Uint8Array([53, 204, 20, 133, 220, 71, 214, 128]);

export function getLoanCreatedV1DiscriminatorBytes(): Uint8Array {
    return LOAN_CREATED_V1_DISCRIMINATOR;
}

export type LoanCreatedV1 = { loan: LoanEventV1; pubkey: Address };

function getLoanCreatedV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_CREATED_V1_DISCRIMINATOR)],
    );
}

export function parseLoanCreatedV1(data: Uint8Array): LoanCreatedV1 {
    if (!LOAN_CREATED_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOANCREATEDV1 discriminator mismatch');
    }
    const decoded = getLoanCreatedV1Decoder().decode(data);
    return decoded as LoanCreatedV1;
}
