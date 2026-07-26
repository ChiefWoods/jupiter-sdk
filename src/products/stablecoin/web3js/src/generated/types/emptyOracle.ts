import { fixCodecSize, getBytesCodec, getStructCodec } from '@solana/codecs';

export interface EmptyOracle {
    reserved: Uint8Array;
    reserved1: Uint8Array;
    reserved2: Uint8Array;
    reserved3: Uint8Array;
}

export const emptyOracleCodec = getStructCodec([
    ['reserved', fixCodecSize(getBytesCodec(), 32)],
    ['reserved1', fixCodecSize(getBytesCodec(), 32)],
    ['reserved2', fixCodecSize(getBytesCodec(), 32)],
    ['reserved3', fixCodecSize(getBytesCodec(), 24)],
]);
