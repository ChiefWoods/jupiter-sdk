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

export const VAULT_WITHDRAWAL_DISCRIMINATOR = new Uint8Array([168, 109, 95, 252, 76, 240, 237, 56]);

export function getVaultWithdrawalDiscriminatorBytes(): Uint8Array {
    return VAULT_WITHDRAWAL_DISCRIMINATOR;
}

export type VaultWithdrawal = {
    owner: Address;
    ownerAccount: Address;
    amountUsd: bigint;
    balanceAfter: bigint;
    timestamp: bigint;
};

function getVaultWithdrawalDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['ownerAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['amountUsd', getU64Decoder()],
            ['balanceAfter', getU64Decoder()],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(VAULT_WITHDRAWAL_DISCRIMINATOR)],
    );
}

export function parseVaultWithdrawal(data: Uint8Array): VaultWithdrawal {
    if (!VAULT_WITHDRAWAL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('VAULTWITHDRAWAL discriminator mismatch');
    }
    const decoded = getVaultWithdrawalDecoder().decode(data);
    return decoded as VaultWithdrawal;
}
