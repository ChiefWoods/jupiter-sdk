import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';
import { getEventAssetDecoder, type EventAsset } from '../types/eventAsset';

export const ESCROW_DEPOSIT_DISCRIMINATOR = new Uint8Array([43, 90, 49, 176, 134, 148, 50, 32]);

export function getEscrowDepositDiscriminatorBytes(): Uint8Array {
    return ESCROW_DEPOSIT_DISCRIMINATOR;
}

export type EscrowDeposit = {
    user: Address;
    asset: EventAsset;
    depositAmount: bigint;
    totalAmount: bigint;
    timestamp: bigint;
};

function getEscrowDepositDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['asset', getEventAssetDecoder()],
            ['depositAmount', getU64Decoder()],
            ['totalAmount', getU64Decoder()],
            ['timestamp', getU64Decoder()],
        ]),
        [getConstantDecoder(ESCROW_DEPOSIT_DISCRIMINATOR)],
    );
}

export function parseEscrowDeposit(data: Uint8Array): EscrowDeposit {
    if (!ESCROW_DEPOSIT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EscrowDeposit discriminator mismatch');
    }
    const decoded = getEscrowDepositDecoder().decode(data);
    return decoded as EscrowDeposit;
}
