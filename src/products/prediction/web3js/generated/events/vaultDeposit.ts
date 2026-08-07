import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const VAULT_DEPOSIT_DISCRIMINATOR = new Uint8Array([4, 248, 234, 163, 99, 238, 140, 45]);

export function getVaultDepositDiscriminatorBytes(): Uint8Array {
    return VAULT_DEPOSIT_DISCRIMINATOR;
}

export type VaultDeposit = {
    owner: Address;
    ownerAccount: Address;
    amountUsd: bigint;
    balanceAfter: bigint;
    timestamp: bigint;
};

function getVaultDepositDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ownerAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amountUsd', getU64Decoder()],
            ['balanceAfter', getU64Decoder()],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(VAULT_DEPOSIT_DISCRIMINATOR)],
    );
}

export function parseVaultDeposit(data: Uint8Array): VaultDeposit {
    if (!VAULT_DEPOSIT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VAULTDEPOSIT discriminator mismatch');
    }
    const decoded = getVaultDepositDecoder().decode(data);
    return decoded as VaultDeposit;
}
