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

export const EVENT_FUND_ROOT_ESCROW_DISCRIMINATOR = new Uint8Array([74, 8, 68, 181, 198, 235, 138, 81]);

export function getEventFundRootEscrowDiscriminatorBytes(): Uint8Array {
    return EVENT_FUND_ROOT_ESCROW_DISCRIMINATOR;
}

export type EventFundRootEscrow = { rootEscrow: Address; fundedAmount: bigint };

function getEventFundRootEscrowDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['rootEscrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['fundedAmount', getU64Decoder()],
        ]),
        [getConstantDecoder(EVENT_FUND_ROOT_ESCROW_DISCRIMINATOR)],
    );
}

export function parseEventFundRootEscrow(data: Uint8Array): EventFundRootEscrow {
    if (!EVENT_FUND_ROOT_ESCROW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventFundRootEscrow discriminator mismatch');
    }
    const decoded = getEventFundRootEscrowDecoder().decode(data);
    return decoded as EventFundRootEscrow;
}
