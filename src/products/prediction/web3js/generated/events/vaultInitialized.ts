import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const VAULT_INITIALIZED_DISCRIMINATOR = new Uint8Array([180, 43, 207, 2, 18, 71, 3, 75]);

export function getVaultInitializedDiscriminatorBytes(): Uint8Array {
    return VAULT_INITIALIZED_DISCRIMINATOR;
}

export type VaultInitialized = { vault: Address; config: Address; settlementMint: Address; timestamp: bigint };

function getVaultInitializedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vault', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['config', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['settlementMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(VAULT_INITIALIZED_DISCRIMINATOR)],
    );
}

export function parseVaultInitialized(data: Uint8Array): VaultInitialized {
    if (!VAULT_INITIALIZED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VAULTINITIALIZED discriminator mismatch');
    }
    const decoded = getVaultInitializedDecoder().decode(data);
    return decoded as VaultInitialized;
}
