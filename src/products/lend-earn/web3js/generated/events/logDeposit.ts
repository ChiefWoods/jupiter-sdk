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

export const LOG_DEPOSIT_DISCRIMINATOR = new Uint8Array([176, 243, 1, 56, 142, 206, 1, 106]);

export function getLogDepositDiscriminatorBytes(): Uint8Array {
    return LOG_DEPOSIT_DISCRIMINATOR;
}

export type LogDeposit = { sender: Address; receiver: Address; assets: bigint; sharesMinted: bigint };

function getLogDepositDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['sender', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['receiver', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['assets', getU64Decoder()],
            ['sharesMinted', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_DEPOSIT_DISCRIMINATOR)],
    );
}

export function parseLogDeposit(data: Uint8Array): LogDeposit {
    if (!LOG_DEPOSIT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGDEPOSIT discriminator mismatch');
    }
    const decoded = getLogDepositDecoder().decode(data);
    return decoded as LogDeposit;
}
