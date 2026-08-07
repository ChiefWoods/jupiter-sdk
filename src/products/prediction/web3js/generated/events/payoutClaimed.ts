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

export const PAYOUT_CLAIMED_DISCRIMINATOR = new Uint8Array([200, 39, 105, 112, 116, 63, 58, 149]);

export function getPayoutClaimedDiscriminatorBytes(): Uint8Array {
    return PAYOUT_CLAIMED_DISCRIMINATOR;
}

export type PayoutClaimed = {
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
    /**
     * Flat payout per contract in micro-USD (e.g. 1_000_000 for full win, 500_000 for split).
     * Always 0 for refund outcomes — refund payouts equal `position.total_cost_usd` and are
     * not a per-contract rate; read `payout_amount` instead.
     */
    payoutPerContractUsd: bigint;
};

function getPayoutClaimedDecoder() {
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
            ['payoutPerContractUsd', getU64Decoder()],
        ]),
        [getConstantDecoder(PAYOUT_CLAIMED_DISCRIMINATOR)],
    );
}

export function parsePayoutClaimed(data: Uint8Array): PayoutClaimed {
    if (!PAYOUT_CLAIMED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('PAYOUTCLAIMED discriminator mismatch');
    }
    const decoded = getPayoutClaimedDecoder().decode(data);
    return decoded as PayoutClaimed;
}
