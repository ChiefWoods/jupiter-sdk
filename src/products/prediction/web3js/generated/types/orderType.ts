import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OrderType {
    Market,
    Limit,
}

export type OrderTypeArgs = OrderType;

export function getOrderTypeEncoder(): Encoder<OrderTypeArgs> {
    return getEnumEncoder(OrderType);
}

export function getOrderTypeDecoder(): Decoder<OrderType> {
    return getEnumDecoder(OrderType);
}

export function getOrderTypeCodec(): Codec<OrderTypeArgs, OrderType> {
    return combineCodec(getOrderTypeEncoder(), getOrderTypeDecoder());
}
