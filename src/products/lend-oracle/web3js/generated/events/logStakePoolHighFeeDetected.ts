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

export const LOG_STAKE_POOL_HIGH_FEE_DETECTED_DISCRIMINATOR = new Uint8Array([198, 106, 149, 7, 25, 83, 39, 155]);

export function getLogStakePoolHighFeeDetectedDiscriminatorBytes(): Uint8Array {
    return LOG_STAKE_POOL_HIGH_FEE_DETECTED_DISCRIMINATOR;
}

export type LogStakePoolHighFeeDetected = { stakePool: Address; epoch: bigint };

function getLogStakePoolHighFeeDetectedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['stakePool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['epoch', getU64Decoder()],
        ]),
        [getConstantDecoder(LOG_STAKE_POOL_HIGH_FEE_DETECTED_DISCRIMINATOR)],
    );
}

export function parseLogStakePoolHighFeeDetected(data: Uint8Array): LogStakePoolHighFeeDetected {
    if (!LOG_STAKE_POOL_HIGH_FEE_DETECTED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGSTAKEPOOLHIGHFEEDETECTED discriminator mismatch');
    }
    const decoded = getLogStakePoolHighFeeDetectedDecoder().decode(data);
    return decoded as LogStakePoolHighFeeDetected;
}
