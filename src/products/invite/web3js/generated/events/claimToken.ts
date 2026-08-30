import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const CLAIM_TOKEN_DISCRIMINATOR = new Uint8Array([193, 131, 59, 210, 91, 145, 198, 255]);

export function getClaimTokenDiscriminatorBytes(): Uint8Array {
    return CLAIM_TOKEN_DISCRIMINATOR;
}

export type ClaimToken = { claimer: Address; sender: Address; inviteSigner: Address; amount: bigint; mint: Address };

function getClaimTokenDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['claimer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['inviteSigner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CLAIM_TOKEN_DISCRIMINATOR)],
    );
}

export function parseClaimToken(data: Uint8Array): ClaimToken {
    if (!CLAIM_TOKEN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ClaimToken discriminator mismatch');
    }
    const decoded = getClaimTokenDecoder().decode(data);
    return decoded as ClaimToken;
}
