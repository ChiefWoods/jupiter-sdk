import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type SwitchboardOnDemandOracle = {
    account: Address;
    reserved: ReadonlyUint8Array;
    reserved1: ReadonlyUint8Array;
    reserved2: ReadonlyUint8Array;
};

export type SwitchboardOnDemandOracleArgs = SwitchboardOnDemandOracle;

export function getSwitchboardOnDemandOracleEncoder(): Encoder<SwitchboardOnDemandOracleArgs> {
    return getStructEncoder([
        ['account', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['reserved', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved1', fixEncoderSize(getBytesEncoder(), 32)],
        ['reserved2', fixEncoderSize(getBytesEncoder(), 24)],
    ]);
}

export function getSwitchboardOnDemandOracleDecoder(): Decoder<SwitchboardOnDemandOracle> {
    return getStructDecoder([
        ['account', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['reserved', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved1', fixDecoderSize(getBytesDecoder(), 32)],
        ['reserved2', fixDecoderSize(getBytesDecoder(), 24)],
    ]);
}

export function getSwitchboardOnDemandOracleCodec(): Codec<SwitchboardOnDemandOracleArgs, SwitchboardOnDemandOracle> {
    return combineCodec(getSwitchboardOnDemandOracleEncoder(), getSwitchboardOnDemandOracleDecoder());
}
