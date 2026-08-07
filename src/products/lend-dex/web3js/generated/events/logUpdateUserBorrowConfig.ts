import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_USER_BORROW_CONFIG_DISCRIMINATOR = new Uint8Array([70, 142, 184, 48, 44, 158, 166, 3]);

export function getLogUpdateUserBorrowConfigDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_USER_BORROW_CONFIG_DISCRIMINATOR;
}

export type LogUpdateUserBorrowConfig = {
    dexId: number;
    protocol: Address;
    expandPercent: number;
    expandDuration: number;
    baseDebtCeiling: bigint;
    maxDebtCeiling: bigint;
};

function getLogUpdateUserBorrowConfigDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['expandPercent', getU16Decoder()],
            ['expandDuration', getU32Decoder()],
            ['baseDebtCeiling', getU64Decoder()],
            ['maxDebtCeiling', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_USER_BORROW_CONFIG_DISCRIMINATOR)],
    );
}

export function parseLogUpdateUserBorrowConfig(data: Uint8Array): LogUpdateUserBorrowConfig {
    if (!LOG_UPDATE_USER_BORROW_CONFIG_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEUSERBORROWCONFIG discriminator mismatch');
    }
    const decoded = getLogUpdateUserBorrowConfigDecoder().decode(data);
    return decoded as LogUpdateUserBorrowConfig;
}
