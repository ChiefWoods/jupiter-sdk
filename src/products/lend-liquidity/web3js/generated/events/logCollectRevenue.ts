import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU128Decoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_COLLECT_REVENUE_DISCRIMINATOR = new Uint8Array([64, 198, 22, 194, 123, 87, 166, 82]);

export function getLogCollectRevenueDiscriminatorBytes(): Uint8Array {
    return LOG_COLLECT_REVENUE_DISCRIMINATOR;
}

export type LogCollectRevenue = { token: Address; revenueAmount: bigint };

function getLogCollectRevenueDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['revenueAmount', getU128Decoder()],
        ]),
        [getConstantDecoder(LOG_COLLECT_REVENUE_DISCRIMINATOR)],
    );
}

export function parseLogCollectRevenue(data: Uint8Array): LogCollectRevenue {
    if (!LOG_COLLECT_REVENUE_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGCOLLECTREVENUE discriminator mismatch');
    }
    const decoded = getLogCollectRevenueDecoder().decode(data);
    return decoded as LogCollectRevenue;
}
