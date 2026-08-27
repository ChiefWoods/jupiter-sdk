import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_VAULT_CONFIG_DISCRIMINATOR = new Uint8Array([194, 158, 35, 55, 179, 48, 174, 46]);

export function getLogInitVaultConfigDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_VAULT_CONFIG_DISCRIMINATOR;
}

export type LogInitVaultConfig = { vaultConfig: Address };

function getLogInitVaultConfigDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vaultConfig', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_INIT_VAULT_CONFIG_DISCRIMINATOR)],
    );
}

export function parseLogInitVaultConfig(data: Uint8Array): LogInitVaultConfig {
    if (!LOG_INIT_VAULT_CONFIG_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogInitVaultConfig discriminator mismatch');
    }
    const decoded = getLogInitVaultConfigDecoder().decode(data);
    return decoded as LogInitVaultConfig;
}
