import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_DEX_METADATA_DISCRIMINATOR = new Uint8Array([53, 61, 248, 111, 245, 219, 167, 73]);

export function getLogInitDexMetadataDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_DEX_METADATA_DISCRIMINATOR;
}

export type LogInitDexMetadata = { dexId: number; lookupTable: Address };

function getLogInitDexMetadataDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['lookupTable', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_INIT_DEX_METADATA_DISCRIMINATOR)],
    );
}

export function parseLogInitDexMetadata(data: Uint8Array): LogInitDexMetadata {
    if (!LOG_INIT_DEX_METADATA_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGINITDEXMETADATA discriminator mismatch');
    }
    const decoded = getLogInitDexMetadataDecoder().decode(data);
    return decoded as LogInitDexMetadata;
}
