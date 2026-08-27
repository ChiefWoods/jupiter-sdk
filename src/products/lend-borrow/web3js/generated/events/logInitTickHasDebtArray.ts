import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_TICK_HAS_DEBT_ARRAY_DISCRIMINATOR = new Uint8Array([15, 134, 113, 2, 251, 206, 30, 129]);

export function getLogInitTickHasDebtArrayDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_TICK_HAS_DEBT_ARRAY_DISCRIMINATOR;
}

export type LogInitTickHasDebtArray = { tickHasDebtArray: Address };

function getLogInitTickHasDebtArrayDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['tickHasDebtArray', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ]),
        [getConstantDecoder(LOG_INIT_TICK_HAS_DEBT_ARRAY_DISCRIMINATOR)],
    );
}

export function parseLogInitTickHasDebtArray(data: Uint8Array): LogInitTickHasDebtArray {
    if (!LOG_INIT_TICK_HAS_DEBT_ARRAY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogInitTickHasDebtArray discriminator mismatch');
    }
    const decoded = getLogInitTickHasDebtArrayDecoder().decode(data);
    return decoded as LogInitTickHasDebtArray;
}
