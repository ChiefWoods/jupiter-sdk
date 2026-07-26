import { getU8Codec } from '@solana/codecs';

export enum DexPegOracleKind {
    Col,
    Debt,
}

export const dexPegOracleKindCodec = getU8Codec();
