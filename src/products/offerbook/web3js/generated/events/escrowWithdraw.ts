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

export const ESCROW_WITHDRAW_DISCRIMINATOR = new Uint8Array([171, 17, 164, 116, 122, 66, 183, 34]);

export function getEscrowWithdrawDiscriminatorBytes(): Uint8Array {
    return ESCROW_WITHDRAW_DISCRIMINATOR;
}

export type EscrowWithdraw = {
    user: Address;
    asset: EventAsset;
    withdrawAmount: bigint;
    totalAmount: bigint;
    timestamp: bigint;
};

function getEscrowWithdrawDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['asset', getEventAssetDecoder()],
            ['withdrawAmount', getU64Decoder()],
            ['totalAmount', getU64Decoder()],
            ['timestamp', getU64Decoder()],
        ]),
        [getConstantDecoder(ESCROW_WITHDRAW_DISCRIMINATOR)],
    );
}

export function parseEscrowWithdraw(data: Uint8Array): EscrowWithdraw {
    if (!ESCROW_WITHDRAW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EscrowWithdraw discriminator mismatch');
    }
    const decoded = getEscrowWithdrawDecoder().decode(data);
    return decoded as EscrowWithdraw;
}
