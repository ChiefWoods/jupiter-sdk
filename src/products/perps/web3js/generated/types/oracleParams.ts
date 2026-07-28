import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getOracleTypeDecoder, getOracleTypeEncoder, type OracleType, type OracleTypeArgs } from '../types/oracleType';

export type OracleParams = { oracleAccount: Address; oracleType: OracleType; buffer: bigint; maxPriceAgeSec: number };

export type OracleParamsArgs = {
    oracleAccount: Address;
    oracleType: OracleTypeArgs;
    buffer: number | bigint;
    maxPriceAgeSec: number;
};

export function getOracleParamsEncoder(): Encoder<OracleParamsArgs> {
    return getStructEncoder([
        ['oracleAccount', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['oracleType', getOracleTypeEncoder()],
        ['buffer', getU64Encoder()],
        ['maxPriceAgeSec', getU32Encoder()],
    ]);
}

export function getOracleParamsDecoder(): Decoder<OracleParams> {
    return getStructDecoder([
        ['oracleAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['oracleType', getOracleTypeDecoder()],
        ['buffer', getU64Decoder()],
        ['maxPriceAgeSec', getU32Decoder()],
    ]);
}

export function getOracleParamsCodec(): Codec<OracleParamsArgs, OracleParams> {
    return combineCodec(getOracleParamsEncoder(), getOracleParamsDecoder());
}
