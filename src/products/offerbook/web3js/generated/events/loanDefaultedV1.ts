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

export const LOAN_DEFAULTED_V1_DISCRIMINATOR = new Uint8Array([232, 160, 77, 36, 232, 60, 14, 73]);

export function getLoanDefaultedV1DiscriminatorBytes(): Uint8Array {
    return LOAN_DEFAULTED_V1_DISCRIMINATOR;
}

export type LoanDefaultedV1 = { loan: LoanEventV1; pubkey: Address };

function getLoanDefaultedV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV1Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_DEFAULTED_V1_DISCRIMINATOR)],
    );
}

export function parseLoanDefaultedV1(data: Uint8Array): LoanDefaultedV1 {
    if (!LOAN_DEFAULTED_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOANDEFAULTEDV1 discriminator mismatch');
    }
    const decoded = getLoanDefaultedV1Decoder().decode(data);
    return decoded as LoanDefaultedV1;
}
