import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export const EVENT_CREATE_ROOT_ESCROW_DISCRIMINATOR = new Uint8Array([105, 216, 97, 182, 27, 224, 199, 228]);

export function getEventCreateRootEscrowDiscriminatorBytes(): Uint8Array {
    return EVENT_CREATE_ROOT_ESCROW_DISCRIMINATOR;
}

export type EventCreateRootEscrow = {
    rootEscrow: Address;
    maxClaimAmount: bigint;
    maxEscrow: bigint;
    version: bigint;
    root: ReadonlyUint8Array;
};

function getEventCreateRootEscrowDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['rootEscrow', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['maxClaimAmount', getU64Decoder()],
            ['maxEscrow', getU64Decoder()],
            ['version', getU64Decoder()],
            ['root', fixDecoderSize(getBytesDecoder(), 32)],
        ]),
        [getConstantDecoder(EVENT_CREATE_ROOT_ESCROW_DISCRIMINATOR)],
    );
}

export function parseEventCreateRootEscrow(data: Uint8Array): EventCreateRootEscrow {
    if (!EVENT_CREATE_ROOT_ESCROW_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('EventCreateRootEscrow discriminator mismatch');
    }
    const decoded = getEventCreateRootEscrowDecoder().decode(data);
    return decoded as EventCreateRootEscrow;
}
