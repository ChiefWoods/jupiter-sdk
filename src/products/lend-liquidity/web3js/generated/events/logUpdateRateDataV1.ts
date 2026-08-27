import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getRateDataV1ParamsDecoder, type RateDataV1Params } from '../types/rateDataV1Params';

export const LOG_UPDATE_RATE_DATA_V1_DISCRIMINATOR = new Uint8Array([30, 102, 131, 192, 0, 30, 85, 223]);

export function getLogUpdateRateDataV1DiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_RATE_DATA_V1_DISCRIMINATOR;
}

export type LogUpdateRateDataV1 = { token: Address; rateData: RateDataV1Params };

function getLogUpdateRateDataV1Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['rateData', getRateDataV1ParamsDecoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_RATE_DATA_V1_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRateDataV1(data: Uint8Array): LogUpdateRateDataV1 {
    if (!LOG_UPDATE_RATE_DATA_V1_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogUpdateRateDataV1 discriminator mismatch');
    }
    const decoded = getLogUpdateRateDataV1Decoder().decode(data);
    return decoded as LogUpdateRateDataV1;
}
