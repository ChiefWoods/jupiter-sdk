import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU128Decoder,
    getU128Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** @notice struct to set token config */
export type TokenConfig = {
    /**
     *
     * @param token address
     */
    token: Address;
    /**
     *
     * @param fee charges on borrower's interest. in 1e2: 100% = 10_000; 1% = 100
     */
    fee: bigint;
    /**
     *
     * @param maxUtilization maximum allowed utilization. in 1e2: 100% = 10_000; 1% = 100
     * set to 100% to disable and have default limit of 100% (avoiding SLOAD).
     */
    maxUtilization: bigint;
};

export type TokenConfigArgs = {
    /**
     *
     * @param token address
     */
    token: Address;
    /**
     *
     * @param fee charges on borrower's interest. in 1e2: 100% = 10_000; 1% = 100
     */
    fee: number | bigint;
    /**
     *
     * @param maxUtilization maximum allowed utilization. in 1e2: 100% = 10_000; 1% = 100
     * set to 100% to disable and have default limit of 100% (avoiding SLOAD).
     */
    maxUtilization: number | bigint;
};

export function getTokenConfigEncoder(): Encoder<TokenConfigArgs> {
    return getStructEncoder([
        ['token', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['fee', getU128Encoder()],
        ['maxUtilization', getU128Encoder()],
    ]);
}

export function getTokenConfigDecoder(): Decoder<TokenConfig> {
    return getStructDecoder([
        ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['fee', getU128Decoder()],
        ['maxUtilization', getU128Decoder()],
    ]);
}

export function getTokenConfigCodec(): Codec<TokenConfigArgs, TokenConfig> {
    return combineCodec(getTokenConfigEncoder(), getTokenConfigDecoder());
}
