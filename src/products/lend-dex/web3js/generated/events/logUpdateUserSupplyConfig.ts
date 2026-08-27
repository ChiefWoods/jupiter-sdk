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

export const LOG_UPDATE_USER_SUPPLY_CONFIG_DISCRIMINATOR = new Uint8Array([86, 139, 35, 235, 30, 42, 192, 245]);

export function getLogUpdateUserSupplyConfigDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_USER_SUPPLY_CONFIG_DISCRIMINATOR;
}

export type LogUpdateUserSupplyConfig = {
    dexId: number;
    protocol: Address;
    expandPercent: number;
    expandDuration: bigint;
    baseWithdrawalLimit: bigint;
};

function getLogUpdateUserSupplyConfigDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['dexId', getU16Decoder()],
            ['protocol', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['expandPercent', getU16Decoder()],
            ['expandDuration', getU64Decoder()],
            ['baseWithdrawalLimit', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_USER_SUPPLY_CONFIG_DISCRIMINATOR)],
    );
}

export function parseLogUpdateUserSupplyConfig(data: Uint8Array): LogUpdateUserSupplyConfig {
    if (!LOG_UPDATE_USER_SUPPLY_CONFIG_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateUserSupplyConfig discriminator mismatch');
    }
    const decoded = getLogUpdateUserSupplyConfigDecoder().decode(data);
    return decoded as LogUpdateUserSupplyConfig;
}
