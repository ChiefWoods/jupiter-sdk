import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getU8Decoder,
    getUtf8Decoder,
    transformDecoder,
} from '@solana/codecs';

export const POSITION_LOST_DISCRIMINATOR = new Uint8Array([139, 42, 180, 84, 194, 237, 88, 58]);

export function getPositionLostDiscriminatorBytes(): Uint8Array {
    return POSITION_LOST_DISCRIMINATOR;
}

export type PositionLost = {
    marketId: string;
    position: Address;
    owner: Address;
    isYes: boolean;
    contractsSettled: bigint;
    payoutAmount: bigint;
    transferAmountToken: bigint;
    feeUsd: bigint;
    realizedPnl: bigint;
    updatedBy: Address;
    timestamp: bigint;
    overallFeesPaidUsd: bigint;
    overallRealizedPnlUsd: bigint;
    overallTotalCostUsd: bigint;
    /** Market outcome: 0 = No, 1 = Yes, 2 = Split, 3 = Refund */
    outcome: number;
};

function getPositionLostDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['position', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['isYes', getBooleanDecoder()],
            ['contractsSettled', getU64Decoder()],
            ['payoutAmount', getU64Decoder()],
            ['transferAmountToken', getU64Decoder()],
            ['feeUsd', getU64Decoder()],
            ['realizedPnl', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
            ['overallFeesPaidUsd', getU64Decoder()],
            ['overallRealizedPnlUsd', getI64Decoder()],
            ['overallTotalCostUsd', getU64Decoder()],
            ['outcome', getU8Decoder()],
        ]),
        [getConstantDecoder(POSITION_LOST_DISCRIMINATOR)],
    );
}

export function parsePositionLost(data: Uint8Array): PositionLost {
    if (!POSITION_LOST_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('POSITIONLOST discriminator mismatch');
    }
    const decoded = getPositionLostDecoder().decode(data);
    return decoded as PositionLost;
}
