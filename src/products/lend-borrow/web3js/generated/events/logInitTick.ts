import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_TICK_DISCRIMINATOR = new Uint8Array([56, 182, 35, 79, 249, 114, 9, 175]);

export function getLogInitTickDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_TICK_DISCRIMINATOR;
}

export type LogInitTick = { tick: Address };

function getLogInitTickDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['tick', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_INIT_TICK_DISCRIMINATOR)],
    );
}

export function parseLogInitTick(data: Uint8Array): LogInitTick {
    if (!LOG_INIT_TICK_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogInitTick discriminator mismatch');
    }
    const decoded = getLogInitTickDecoder().decode(data);
    return decoded as LogInitTick;
}
