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

export const LOG_CLAIM_DISCRIMINATOR = new Uint8Array([238, 50, 157, 85, 151, 58, 231, 45]);

export function getLogClaimDiscriminatorBytes(): Uint8Array {
    return LOG_CLAIM_DISCRIMINATOR;
}

export type LogClaim = { user: Address; token: Address; recipient: Address; amount: bigint };

function getLogClaimDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['recipient', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_CLAIM_DISCRIMINATOR)],
    );
}

export function parseLogClaim(data: Uint8Array): LogClaim {
    if (!LOG_CLAIM_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGCLAIM discriminator mismatch');
    }
    const decoded = getLogClaimDecoder().decode(data);
    return decoded as LogClaim;
}
