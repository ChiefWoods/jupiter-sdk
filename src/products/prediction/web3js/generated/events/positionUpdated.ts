import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const POSITION_UPDATED_DISCRIMINATOR = new Uint8Array([208, 212, 54, 188, 246, 71, 235, 88]);

export function getPositionUpdatedDiscriminatorBytes(): Uint8Array {
    return POSITION_UPDATED_DISCRIMINATOR;
}

export type PositionUpdated = {
    position: Address;
    owner: Address;
    isYes: boolean;
    contracts: bigint;
    totalCostUsd: bigint;
    realizedPnlUsd: bigint;
    timestamp: bigint;
};

function getPositionUpdatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['position', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['isYes', getBooleanDecoder()],
            ['contracts', getU64Decoder()],
            ['totalCostUsd', getU64Decoder()],
            ['realizedPnlUsd', getI64Decoder()],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(POSITION_UPDATED_DISCRIMINATOR)],
    );
}

export function parsePositionUpdated(data: Uint8Array): PositionUpdated {
    if (!POSITION_UPDATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('POSITIONUPDATED discriminator mismatch');
    }
    const decoded = getPositionUpdatedDecoder().decode(data);
    return decoded as PositionUpdated;
}
