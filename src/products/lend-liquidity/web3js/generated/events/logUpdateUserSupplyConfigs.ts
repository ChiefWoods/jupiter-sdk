import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getUserSupplyConfigDecoder, type UserSupplyConfig } from '../types/userSupplyConfig';

export const LOG_UPDATE_USER_SUPPLY_CONFIGS_DISCRIMINATOR = new Uint8Array([142, 160, 21, 90, 87, 88, 18, 51]);

export function getLogUpdateUserSupplyConfigsDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_USER_SUPPLY_CONFIGS_DISCRIMINATOR;
}

export type LogUpdateUserSupplyConfigs = { user: Address; token: Address; userSupplyConfig: UserSupplyConfig };

function getLogUpdateUserSupplyConfigsDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['userSupplyConfig', getUserSupplyConfigDecoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_USER_SUPPLY_CONFIGS_DISCRIMINATOR)],
    );
}

export function parseLogUpdateUserSupplyConfigs(data: Uint8Array): LogUpdateUserSupplyConfigs {
    if (!LOG_UPDATE_USER_SUPPLY_CONFIGS_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEUSERSUPPLYCONFIGS discriminator mismatch');
    }
    const decoded = getLogUpdateUserSupplyConfigsDecoder().decode(data);
    return decoded as LogUpdateUserSupplyConfigs;
}
