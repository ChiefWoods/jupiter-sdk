import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum RequestType {
    Market,
    Trigger,
}

export type RequestTypeArgs = RequestType;

export function getRequestTypeEncoder(): Encoder<RequestTypeArgs> {
    return getEnumEncoder(RequestType);
}

export function getRequestTypeDecoder(): Decoder<RequestType> {
    return getEnumDecoder(RequestType);
}

export function getRequestTypeCodec(): Codec<RequestTypeArgs, RequestType> {
    return combineCodec(getRequestTypeEncoder(), getRequestTypeDecoder());
}
