import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI32Decoder,
    getStructDecoder,
    transformDecoder,
} from '@solana/codecs';

export const LOG_INIT_TICK_ID_LIQUIDATION_DISCRIMINATOR = new Uint8Array([172, 64, 170, 238, 39, 153, 185, 225]);

export function getLogInitTickIdLiquidationDiscriminatorBytes(): Uint8Array {
    return LOG_INIT_TICK_ID_LIQUIDATION_DISCRIMINATOR;
}

export type LogInitTickIdLiquidation = { tickIdLiquidation: Address; tick: number };

function getLogInitTickIdLiquidationDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['tickIdLiquidation', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['tick', getI32Decoder()],
        ]),
        [getConstantDecoder(LOG_INIT_TICK_ID_LIQUIDATION_DISCRIMINATOR)],
    );
}

export function parseLogInitTickIdLiquidation(data: Uint8Array): LogInitTickIdLiquidation {
    if (!LOG_INIT_TICK_ID_LIQUIDATION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('LogInitTickIdLiquidation discriminator mismatch');
    }
    const decoded = getLogInitTickIdLiquidationDecoder().decode(data);
    return decoded as LogInitTickIdLiquidation;
}
