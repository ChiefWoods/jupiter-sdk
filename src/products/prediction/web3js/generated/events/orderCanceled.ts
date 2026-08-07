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

export const ORDER_CANCELED_DISCRIMINATOR = new Uint8Array([210, 147, 48, 247, 204, 118, 255, 121]);

export function getOrderCanceledDiscriminatorBytes(): Uint8Array {
    return ORDER_CANCELED_DISCRIMINATOR;
}

export type OrderCanceled = {
    order: Address;
    marketId: string;
    owner: Address;
    externalOrderId: string;
    orderId: Option<string>;
    status: OrderStatus;
    isBuy: boolean;
    isYes: boolean;
    contracts: bigint;
    filledContracts: bigint;
    maxFillPriceUsd: bigint;
    avgFillPriceUsd: bigint;
    transferAmountToken: bigint;
    canceledBy: Address;
    timestamp: bigint;
};

function getOrderCanceledDecoder() {
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
            ['filledContracts', getU64Decoder()],
            ['maxFillPriceUsd', getU64Decoder()],
            ['avgFillPriceUsd', getU64Decoder()],
            ['transferAmountToken', getU64Decoder()],
            ['canceledBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(ORDER_CANCELED_DISCRIMINATOR)],
    );
}

export function parseOrderCanceled(data: Uint8Array): OrderCanceled {
    if (!ORDER_CANCELED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ORDERCANCELED discriminator mismatch');
    }
    const decoded = getOrderCanceledDecoder().decode(data);
    return decoded as OrderCanceled;
}
