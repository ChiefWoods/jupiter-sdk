import { getU8Codec } from '@solana/codecs';

export enum SourceType {
    Pyth,
    StakePool,
    MsolPool,
    Redstone,
    Chainlink,
    SinglePool,
    JupLend,
    ChainlinkDataStreams,
    PstPool,
    DexSmartColPegOracle,
    DexSmartDebtPegOracle,
}

export const sourceTypeCodec = getU8Codec();
