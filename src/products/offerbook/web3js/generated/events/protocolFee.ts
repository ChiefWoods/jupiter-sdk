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

export const PROTOCOL_FEE_DISCRIMINATOR = new Uint8Array([152, 79, 46, 229, 127, 92, 192, 21]);

export function getProtocolFeeDiscriminatorBytes(): Uint8Array {
    return PROTOCOL_FEE_DISCRIMINATOR;
}

export type ProtocolFee = { mint: Address; amount: bigint; netAmount: bigint; timestamp: bigint };

function getProtocolFeeDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amount', getU64Decoder()],
            ['netAmount', getU64Decoder()],
            ['timestamp', getU64Decoder()],
        ]),
        [getConstantDecoder(PROTOCOL_FEE_DISCRIMINATOR)],
    );
}

export function parseProtocolFee(data: Uint8Array): ProtocolFee {
    if (!PROTOCOL_FEE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PROTOCOLFEE discriminator mismatch');
    }
    const decoded = getProtocolFeeDecoder().decode(data);
    return decoded as ProtocolFee;
}
