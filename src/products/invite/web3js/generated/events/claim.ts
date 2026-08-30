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

export const CLAIM_DISCRIMINATOR = new Uint8Array([133, 98, 9, 238, 133, 207, 191, 113]);

export function getClaimDiscriminatorBytes(): Uint8Array {
    return CLAIM_DISCRIMINATOR;
}

export type Claim = { claimer: Address; sender: Address; inviteSigner: Address; amount: bigint };

function getClaimDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['claimer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['inviteSigner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
        ]),
        [getConstantDecoder(CLAIM_DISCRIMINATOR)],
    );
}

export function parseClaim(data: Uint8Array): Claim {
    if (!CLAIM_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CLAIM discriminator mismatch');
    }
    const decoded = getClaimDecoder().decode(data);
    return decoded as Claim;
}
