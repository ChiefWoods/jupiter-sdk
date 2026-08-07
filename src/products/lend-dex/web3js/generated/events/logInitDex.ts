import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_DEX_DISCRIMINATOR = new Uint8Array([170, 65, 241, 125, 34, 194, 79, 132]);

export function getLogInitDexDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_DEX_DISCRIMINATOR;
}

export type LogInitDex = {
    dexId: number;
    token0: Address;
    token1: Address;
    smartCol: boolean;
    smartDebt: boolean;
    fee: number;
    revenueCut: number;
    centerPrice: bigint;
};

function getLogInitDexDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['token0', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['token1', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['smartCol', getBooleanDecoder()],
            ['smartDebt', getBooleanDecoder()],
            ['fee', getU32Decoder()],
            ['revenueCut', getU32Decoder()],
            ['centerPrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_INIT_DEX_DISCRIMINATOR)],
    );
}

export function parseLogInitDex(data: Uint8Array): LogInitDex {
    if (!LOG_INIT_DEX_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGINITDEX discriminator mismatch');
    }
    const decoded = getLogInitDexDecoder().decode(data);
    return decoded as LogInitDex;
}
