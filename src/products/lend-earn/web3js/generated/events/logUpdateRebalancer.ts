import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_UPDATE_REBALANCER_DISCRIMINATOR = new Uint8Array([66, 79, 144, 204, 26, 217, 153, 225]);

export function getLogUpdateRebalancerDiscriminatorBytes(): Uint8Array {
    return LOG_UPDATE_REBALANCER_DISCRIMINATOR;
}

export type LogUpdateRebalancer = { newRebalancer: Address };

function getLogUpdateRebalancerDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['newRebalancer', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_UPDATE_REBALANCER_DISCRIMINATOR)],
    );
}

export function parseLogUpdateRebalancer(data: Uint8Array): LogUpdateRebalancer {
    if (!LOG_UPDATE_REBALANCER_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LOGUPDATEREBALANCER discriminator mismatch');
    }
    const decoded = getLogUpdateRebalancerDecoder().decode(data);
    return decoded as LogUpdateRebalancer;
}
