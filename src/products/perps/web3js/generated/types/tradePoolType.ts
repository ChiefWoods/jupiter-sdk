import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum TradePoolType {
    Increase,
    Decrease,
}

export type TradePoolTypeArgs = TradePoolType;

export function getTradePoolTypeEncoder(): Encoder<TradePoolTypeArgs> {
    return getEnumEncoder(TradePoolType);
}

export function getTradePoolTypeDecoder(): Decoder<TradePoolType> {
    return getEnumDecoder(TradePoolType);
}

export function getTradePoolTypeCodec(): Codec<TradePoolTypeArgs, TradePoolType> {
    return combineCodec(getTradePoolTypeEncoder(), getTradePoolTypeDecoder());
}
