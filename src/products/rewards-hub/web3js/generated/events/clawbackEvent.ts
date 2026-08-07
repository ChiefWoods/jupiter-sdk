import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const CLAWBACK_DISCRIMINATOR = new Uint8Array([47, 23, 60, 84, 245, 114, 178, 169]);

export function getClawbackEventDiscriminatorBytes(): Uint8Array {
    return CLAWBACK_DISCRIMINATOR;
}

export type Clawback = {
    /** Campaign id. */
    campaignId: string;
    /** Base key of the campaign. */
    base: Address;
    /** Amount clawed back. */
    clawedBackAmount: bigint;
    /** Receiver of the clawback. */
    receiver: Address;
};

function getClawbackDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['campaignId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['base', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['clawedBackAmount', getU64Decoder()],
            ['receiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(CLAWBACK_DISCRIMINATOR)],
    );
}

export function parseClawback(data: Uint8Array): Clawback {
    if (!CLAWBACK_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('CLAWBACK discriminator mismatch');
    }
    const decoded = getClawbackDecoder().decode(data);
    return decoded as Clawback;
}
