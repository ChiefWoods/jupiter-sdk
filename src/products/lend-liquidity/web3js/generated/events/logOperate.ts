import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI128Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_OPERATE_DISCRIMINATOR = new Uint8Array([180, 8, 81, 71, 19, 132, 173, 8]);

export function getLogOperateDiscriminatorBytes(): Uint8Array {
    return LOG_OPERATE_DISCRIMINATOR;
}

export type LogOperate = {
    user: Address;
    token: Address;
    supplyAmount: bigint;
    borrowAmount: bigint;
    withdrawTo: Address;
    borrowTo: Address;
    supplyExchangePrice: bigint;
    borrowExchangePrice: bigint;
};

function getLogOperateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['supplyAmount', getI128Decoder()],
            ['borrowAmount', getI128Decoder()],
            ['withdrawTo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['borrowTo', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['supplyExchangePrice', getU64Decoder()],
            ['borrowExchangePrice', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_OPERATE_DISCRIMINATOR)],
    );
}

export function parseLogOperate(data: Uint8Array): LogOperate {
    if (!LOG_OPERATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogOperate discriminator mismatch');
    }
    const decoded = getLogOperateDecoder().decode(data);
    return decoded as LogOperate;
}
