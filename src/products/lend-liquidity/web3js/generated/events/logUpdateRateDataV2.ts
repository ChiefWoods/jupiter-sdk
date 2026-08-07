import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';
import { getRateDataV2ParamsDecoder, type RateDataV2Params } from '../types/rateDataV2Params';

export const LOG_UPDATE_RATE_DATA_V2_DISCRIMINATOR = new Uint8Array([206, 53, 195, 70, 113, 211, 92, 129]);

export function getLogUpdateRateDataV2DiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_RATE_DATA_V2_DISCRIMINATOR;
}

export type LogUpdateRateDataV2 = { token: Address; rateData: RateDataV2Params };

function getLogUpdateRateDataV2Decoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['token', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['rateData', getRateDataV2ParamsDecoder()],
        ]),
        [getConstantDecoder(LOG_UPDATE_RATE_DATA_V2_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRateDataV2(data: Uint8Array): LogUpdateRateDataV2 {
    if (!LOG_UPDATE_RATE_DATA_V2_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATERATEDATAV2 discriminator mismatch');
    }
    const decoded = getLogUpdateRateDataV2Decoder().decode(data);
    return decoded as LogUpdateRateDataV2;
}
