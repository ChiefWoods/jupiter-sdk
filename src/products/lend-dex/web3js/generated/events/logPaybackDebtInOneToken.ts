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

export const LOG_PAYBACK_DEBT_IN_ONE_TOKEN_DISCRIMINATOR = new Uint8Array([123, 31, 108, 14, 12, 201, 20, 83]);

export function getLogPaybackDebtInOneTokenDiscriminatorBytes(): Uint8Array {
    return LOG_PAYBACK_DEBT_IN_ONE_TOKEN_DISCRIMINATOR;
}

export type LogPaybackDebtInOneToken = {
    dexId: number;
    shares: bigint;
    token0Amt: bigint;
    token1Amt: bigint;
    user: Address;
    protocol: Address;
};

function getLogPaybackDebtInOneTokenDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['shares', getU64Decoder()],
            ['token0Amt', getU64Decoder()],
            ['token1Amt', getU64Decoder()],
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_PAYBACK_DEBT_IN_ONE_TOKEN_DISCRIMINATOR)],
    );
}

export function parseLogPaybackDebtInOneToken(data: Uint8Array): LogPaybackDebtInOneToken {
    if (!LOG_PAYBACK_DEBT_IN_ONE_TOKEN_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogPaybackDebtInOneToken discriminator mismatch');
    }
    const decoded = getLogPaybackDebtInOneTokenDecoder().decode(data);
    return decoded as LogPaybackDebtInOneToken;
}
