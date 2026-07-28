import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OrderStatus {
    Pending,
    Filled,
    Failed,
    PartiallyFilled,
    Cancelled,
}

export type OrderStatusArgs = OrderStatus;

export function getOrderStatusEncoder(): Encoder<OrderStatusArgs> {
    return getEnumEncoder(OrderStatus);
}

export function getOrderStatusDecoder(): Decoder<OrderStatus> {
    return getEnumDecoder(OrderStatus);
}

export function getOrderStatusCodec(): Codec<OrderStatusArgs, OrderStatus> {
    return combineCodec(getOrderStatusEncoder(), getOrderStatusDecoder());
}
