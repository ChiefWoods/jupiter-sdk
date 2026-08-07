import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU128Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_USER_WITHDRAWAL_LIMIT_DISCRIMINATOR = new Uint8Array([114, 131, 152, 189, 120, 253, 88, 105]);

export function getLogUpdateUserWithdrawalLimitDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_USER_WITHDRAWAL_LIMIT_DISCRIMINATOR;
}

export type LogUpdateUserWithdrawalLimit = { user: Address; token: Address; newLimit: bigint };

function getLogUpdateUserWithdrawalLimitDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['newLimit', getU128Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_USER_WITHDRAWAL_LIMIT_DISCRIMINATOR)],
    );
}

export function parseLogUpdateUserWithdrawalLimit(data: Uint8Array): LogUpdateUserWithdrawalLimit {
    if (!LOG_UPDATE_USER_WITHDRAWAL_LIMIT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEUSERWITHDRAWALLIMIT discriminator mismatch');
    }
    const decoded = getLogUpdateUserWithdrawalLimitDecoder().decode(data);
    return decoded as LogUpdateUserWithdrawalLimit;
}
