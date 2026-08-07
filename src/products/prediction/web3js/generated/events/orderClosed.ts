import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    fixDecoderSize,
    getBooleanDecoder,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getOptionDecoder,
    getStructDecoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Option,
} from '@solana/codecs';
import { getOrderStatusDecoder, type OrderStatus } from '../types/orderStatus';

export const ORDER_CLOSED_DISCRIMINATOR = new Uint8Array([237, 77, 101, 123, 72, 43, 149, 123]);

export function getOrderClosedDiscriminatorBytes(): Uint8Array {
    return ORDER_CLOSED_DISCRIMINATOR;
}

export type OrderClosed = {
    order: Address;
    marketId: string;
    owner: Address;
    externalOrderId: string;
    orderId: Option<string>;
    status: OrderStatus;
    isBuy: boolean;
    isYes: boolean;
    contracts: bigint;
    maxFillPriceUsd: bigint;
    transferAmountToken: bigint;
    closedBy: Address;
    timestamp: bigint;
};

function getOrderClosedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['order', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['externalOrderId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['orderId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
            ['status', getOrderStatusDecoder()],
            ['isBuy', getBooleanDecoder()],
            ['isYes', getBooleanDecoder()],
            ['contracts', getU64Decoder()],
            ['maxFillPriceUsd', getU64Decoder()],
            ['transferAmountToken', getU64Decoder()],
            ['closedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(ORDER_CLOSED_DISCRIMINATOR)],
    );
}

export function parseOrderClosed(data: Uint8Array): OrderClosed {
    if (!ORDER_CLOSED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ORDERCLOSED discriminator mismatch');
    }
    const decoded = getOrderClosedDecoder().decode(data);
    return decoded as OrderClosed;
}
