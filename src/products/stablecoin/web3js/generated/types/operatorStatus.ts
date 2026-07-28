import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OperatorStatus {
    Enabled,
    Disabled,
}

export type OperatorStatusArgs = OperatorStatus;

export function getOperatorStatusEncoder(): Encoder<OperatorStatusArgs> {
    return getEnumEncoder(OperatorStatus);
}

export function getOperatorStatusDecoder(): Decoder<OperatorStatus> {
    return getEnumDecoder(OperatorStatus);
}

export function getOperatorStatusCodec(): Codec<OperatorStatusArgs, OperatorStatus> {
    return combineCodec(getOperatorStatusEncoder(), getOperatorStatusDecoder());
}
