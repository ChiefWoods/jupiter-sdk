import { Address } from '@solana/web3.js';
import { SourceType, sourceTypeCodec } from '../types/sourceType';
import {
    fixCodecSize,
    getBooleanCodec,
    getBytesCodec,
    getStructCodec,
    getU128Codec,
    transformCodec,
} from '@solana/codecs';

export interface Sources {
    source: Address;
    invert: boolean;
    multiplier: bigint;
    divisor: bigint;
    sourceType: SourceType;
}

export const sourcesCodec = getStructCodec([
    [
        'source',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['invert', getBooleanCodec()],
    ['multiplier', getU128Codec()],
    ['divisor', getU128Codec()],
    ['sourceType', sourceTypeCodec],
]);
