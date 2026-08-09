import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum Key {
    Uninitialized,
    AssetV1,
    HashedAssetV1,
    PluginHeaderV1,
    PluginRegistryV1,
    CollectionV1,
}

export type KeyArgs = Key;

export function getKeyEncoder(): Encoder<KeyArgs> {
    return getEnumEncoder(Key);
}

export function getKeyDecoder(): Decoder<Key> {
    return getEnumDecoder(Key);
}

export function getKeyCodec(): Codec<KeyArgs, Key> {
    return combineCodec(getKeyEncoder(), getKeyDecoder());
}
