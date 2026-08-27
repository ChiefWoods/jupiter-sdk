import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_WITHDRAW_DISCRIMINATOR = new Uint8Array([49, 9, 176, 179, 222, 190, 6, 117]);

export function getLogWithdrawDiscriminatorBytes(): Uint8Array {
    return LOG_WITHDRAW_DISCRIMINATOR;
}

export type LogWithdraw = { sender: Address; receiver: Address; owner: Address; assets: bigint; sharesBurned: bigint };

function getLogWithdrawDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['receiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['assets', getU64Decoder()],
            ['sharesBurned', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_WITHDRAW_DISCRIMINATOR)],
    );
}

export function parseLogWithdraw(data: Uint8Array): LogWithdraw {
    if (!LOG_WITHDRAW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogWithdraw discriminator mismatch');
    }
    const decoded = getLogWithdrawDecoder().decode(data);
    return decoded as LogWithdraw;
}
