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

export const WITHDRAW_FEES_DISCRIMINATOR = new Uint8Array([236, 118, 138, 90, 139, 173, 177, 89]);

export function getWithdrawFeesEventDiscriminatorBytes(): Uint8Array {
    return WITHDRAW_FEES_DISCRIMINATOR;
}

export type WithdrawFees = {
    pool: Address;
    custody: Address;
    custodyMint: Address;
    receivingTokenAccount: Address;
    totalTradeSwapFees: bigint;
    poolTradeSwapFees: bigint;
    protocolTradeSwapFees: bigint;
    totalBorrowLendingFees: bigint;
    poolBorrowLendingFees: bigint;
    protocolBorrowLendingFees: bigint;
    poolTotalFeesUsd: bigint;
    aprBpsBefore: bigint;
    aprBpsAfter: bigint;
    aprBpsUpdatedAt: bigint;
    poolRealizedFeeUsdBefore: bigint;
    poolRealizedFeeUsdAfter: bigint;
    curtime: bigint;
};

function getWithdrawFeesDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['custodyMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            [
                'receivingTokenAccount',
                transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value)),
            ],
            ['totalTradeSwapFees', getU64Decoder()],
            ['poolTradeSwapFees', getU64Decoder()],
            ['protocolTradeSwapFees', getU64Decoder()],
            ['totalBorrowLendingFees', getU64Decoder()],
            ['poolBorrowLendingFees', getU64Decoder()],
            ['protocolBorrowLendingFees', getU64Decoder()],
            ['poolTotalFeesUsd', getU64Decoder()],
            ['aprBpsBefore', getU64Decoder()],
            ['aprBpsAfter', getU64Decoder()],
            ['aprBpsUpdatedAt', getI64Decoder()],
            ['poolRealizedFeeUsdBefore', getU64Decoder()],
            ['poolRealizedFeeUsdAfter', getU64Decoder()],
            ['curtime', getI64Decoder()],
        ]),
        [getConstantDecoder(WITHDRAW_FEES_DISCRIMINATOR)],
    );
}

export function parseWithdrawFees(data: Uint8Array): WithdrawFees {
    if (!WITHDRAW_FEES_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('WithdrawFees discriminator mismatch');
    }
    const decoded = getWithdrawFeesDecoder().decode(data);
    return decoded as WithdrawFees;
}
