import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum RequestChange {
    None,
    Increase,
    Decrease,
}

export type RequestChangeArgs = RequestChange;

export function getRequestChangeEncoder(): Encoder<RequestChangeArgs> {
    return getEnumEncoder(RequestChange);
}

export function getRequestChangeDecoder(): Decoder<RequestChange> {
    return getEnumDecoder(RequestChange);
}

export function getRequestChangeCodec(): Codec<RequestChangeArgs, RequestChange> {
    return combineCodec(getRequestChangeEncoder(), getRequestChangeDecoder());
}
