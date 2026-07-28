import {
    combineCodec,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type FundingRateState = { cumulativeInterestRate: bigint; lastUpdate: bigint; hourlyFundingDbps: bigint };

export type FundingRateStateArgs = {
    cumulativeInterestRate: number | bigint;
    lastUpdate: number | bigint;
    hourlyFundingDbps: number | bigint;
};

export function getFundingRateStateEncoder(): Encoder<FundingRateStateArgs> {
    return getStructEncoder([
        ['cumulativeInterestRate', getU128Encoder()],
        ['lastUpdate', getI64Encoder()],
        ['hourlyFundingDbps', getU64Encoder()],
    ]);
}

export function getFundingRateStateDecoder(): Decoder<FundingRateState> {
    return getStructDecoder([
        ['cumulativeInterestRate', getU128Decoder()],
        ['lastUpdate', getI64Decoder()],
        ['hourlyFundingDbps', getU64Decoder()],
    ]);
}

export function getFundingRateStateCodec(): Codec<FundingRateStateArgs, FundingRateState> {
    return combineCodec(getFundingRateStateEncoder(), getFundingRateStateDecoder());
}
