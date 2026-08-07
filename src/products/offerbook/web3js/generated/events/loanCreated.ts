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

export const LOAN_CREATED_DISCRIMINATOR = new Uint8Array([142, 148, 28, 215, 65, 185, 246, 200]);

export function getLoanCreatedDiscriminatorBytes(): Uint8Array {
    return LOAN_CREATED_DISCRIMINATOR;
}

export type LoanCreated = { loan: LoanEventV0; pubkey: Address };

function getLoanCreatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['loan', getLoanEventV0Decoder()],
            ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOAN_CREATED_DISCRIMINATOR)],
    );
}

export function parseLoanCreated(data: Uint8Array): LoanCreated {
    if (!LOAN_CREATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOANCREATED discriminator mismatch');
    }
    const decoded = getLoanCreatedDecoder().decode(data);
    return decoded as LoanCreated;
}
