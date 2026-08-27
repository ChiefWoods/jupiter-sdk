import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_VAULT_STATE_DISCRIMINATOR = new Uint8Array([140, 108, 65, 38, 128, 26, 194, 28]);

export function getLogInitVaultStateDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_VAULT_STATE_DISCRIMINATOR;
}

export type LogInitVaultState = { vaultState: Address };

function getLogInitVaultStateDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['vaultState', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_INIT_VAULT_STATE_DISCRIMINATOR)],
    );
}

export function parseLogInitVaultState(data: Uint8Array): LogInitVaultState {
    if (!LOG_INIT_VAULT_STATE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogInitVaultState discriminator mismatch');
    }
    const decoded = getLogInitVaultStateDecoder().decode(data);
    return decoded as LogInitVaultState;
}
