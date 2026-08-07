import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_WITHDRAW_COL_IN_ONE_TOKEN_DISCRIMINATOR = new Uint8Array([86, 6, 224, 183, 211, 209, 199, 232]);

export function getLogWithdrawColInOneTokenDiscriminatorBytes(): Uint8Array {
    return LOG_WITHDRAW_COL_IN_ONE_TOKEN_DISCRIMINATOR;
}

export type LogWithdrawColInOneToken = {
    dexId: number;
    shares: bigint;
    token0Amt: bigint;
    token1Amt: bigint;
    user: Address;
    protocol: Address;
};

function getLogWithdrawColInOneTokenDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['shares', getU64Decoder()],
            ['token0Amt', getU64Decoder()],
            ['token1Amt', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_WITHDRAW_COL_IN_ONE_TOKEN_DISCRIMINATOR)],
    );
}

export function parseLogWithdrawColInOneToken(data: Uint8Array): LogWithdrawColInOneToken {
    if (!LOG_WITHDRAW_COL_IN_ONE_TOKEN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGWITHDRAWCOLINONETOKEN discriminator mismatch');
    }
    const decoded = getLogWithdrawColInOneTokenDecoder().decode(data);
    return decoded as LogWithdrawColInOneToken;
}
