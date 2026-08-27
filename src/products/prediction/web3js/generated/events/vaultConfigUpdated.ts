import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU16Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const VAULT_CONFIG_UPDATED_DISCRIMINATOR = new Uint8Array([72, 22, 37, 111, 58, 30, 160, 212]);

export function getVaultConfigUpdatedDiscriminatorBytes(): Uint8Array {
    return VAULT_CONFIG_UPDATED_DISCRIMINATOR;
}

export type VaultConfigUpdated = {
    config: Address;
    globalMaxContracts: bigint;
    protocolFeeBps: number;
    withdrawalsDisabled: boolean;
    depositsDisabled: boolean;
    timestamp: bigint;
};

function getVaultConfigUpdatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['config', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['globalMaxContracts', getU64Decoder()],
            ['protocolFeeBps', getU16Decoder()],
            ['withdrawalsDisabled', getBooleanDecoder()],
            ['depositsDisabled', getBooleanDecoder()],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(VAULT_CONFIG_UPDATED_DISCRIMINATOR)],
    );
}

export function parseVaultConfigUpdated(data: Uint8Array): VaultConfigUpdated {
    if (!VAULT_CONFIG_UPDATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VaultConfigUpdated discriminator mismatch');
    }
    const decoded = getVaultConfigUpdatedDecoder().decode(data);
    return decoded as VaultConfigUpdated;
}
