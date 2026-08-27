import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_REVENUE_COLLECTOR_DISCRIMINATOR = new Uint8Array([44, 143, 80, 250, 211, 147, 180, 159]);

export function getLogUpdateRevenueCollectorDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_REVENUE_COLLECTOR_DISCRIMINATOR;
}

export type LogUpdateRevenueCollector = { revenueCollector: Address };

function getLogUpdateRevenueCollectorDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['revenueCollector', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_REVENUE_COLLECTOR_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRevenueCollector(data: Uint8Array): LogUpdateRevenueCollector {
    if (!LOG_UPDATE_REVENUE_COLLECTOR_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateRevenueCollector discriminator mismatch');
    }
    const decoded = getLogUpdateRevenueCollectorDecoder().decode(data);
    return decoded as LogUpdateRevenueCollector;
}
