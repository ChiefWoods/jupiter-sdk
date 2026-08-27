import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI128Decoder,
    getStructDecoder,
    getU32Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_OPERATE_DISCRIMINATOR = new Uint8Array([180, 8, 81, 71, 19, 132, 173, 8]);

export function getLogOperateDiscriminatorBytes(): Uint8Array {
    return LOG_OPERATE_DISCRIMINATOR;
}

export type LogOperate = { signer: Address; nftId: number; newCol: bigint; newDebt: bigint; to: Address };

function getLogOperateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['signer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['nftId', getU32Decoder()],
            ['newCol', getI128Decoder()],
            ['newDebt', getI128Decoder()],
            ['to', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
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
