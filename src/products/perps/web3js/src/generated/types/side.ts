import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum Side {
    None,
    Long,
    Short,
}

export type SideArgs = Side;

export function getSideEncoder(): Encoder<SideArgs> {
    return getEnumEncoder(Side);
}

export function getSideDecoder(): Decoder<Side> {
    return getEnumDecoder(Side);
}

export function getSideCodec(): Codec<SideArgs, Side> {
    return combineCodec(getSideEncoder(), getSideDecoder());
}
