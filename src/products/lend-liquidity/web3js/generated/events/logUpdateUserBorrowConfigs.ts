import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getUserBorrowConfigDecoder, type UserBorrowConfig } from '../types/userBorrowConfig';

export const LOG_UPDATE_USER_BORROW_CONFIGS_DISCRIMINATOR = new Uint8Array([210, 251, 242, 159, 205, 33, 154, 74]);

export function getLogUpdateUserBorrowConfigsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_USER_BORROW_CONFIGS_DISCRIMINATOR;
}

export type LogUpdateUserBorrowConfigs = { user: Address; token: Address; userBorrowConfig: UserBorrowConfig };

function getLogUpdateUserBorrowConfigsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['userBorrowConfig', getUserBorrowConfigDecoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_USER_BORROW_CONFIGS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateUserBorrowConfigs(data: Uint8Array): LogUpdateUserBorrowConfigs {
    if (!LOG_UPDATE_USER_BORROW_CONFIGS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEUSERBORROWCONFIGS discriminator mismatch');
    }
    const decoded = getLogUpdateUserBorrowConfigsDecoder().decode(data);
    return decoded as LogUpdateUserBorrowConfigs;
}
