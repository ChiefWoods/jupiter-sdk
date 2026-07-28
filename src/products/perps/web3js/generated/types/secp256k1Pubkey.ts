import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export type Secp256k1Pubkey = { prefix: number; key: ReadonlyUint8Array };

export type Secp256k1PubkeyArgs = Secp256k1Pubkey;

export function getSecp256k1PubkeyEncoder(): Encoder<Secp256k1PubkeyArgs> {
    return getStructEncoder([
        ['prefix', getU8Encoder()],
        ['key', fixEncoderSize(getBytesEncoder(), 32)],
    ]);
}

export function getSecp256k1PubkeyDecoder(): Decoder<Secp256k1Pubkey> {
    return getStructDecoder([
        ['prefix', getU8Decoder()],
        ['key', fixDecoderSize(getBytesDecoder(), 32)],
    ]);
}

export function getSecp256k1PubkeyCodec(): Codec<Secp256k1PubkeyArgs, Secp256k1Pubkey> {
    return combineCodec(getSecp256k1PubkeyEncoder(), getSecp256k1PubkeyDecoder());
}
