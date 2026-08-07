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

export const ORDER_FAILED_DISCRIMINATOR = new Uint8Array([60, 179, 157, 0, 164, 131, 38, 236]);

export function getOrderFailedDiscriminatorBytes(): Uint8Array {
    return ORDER_FAILED_DISCRIMINATOR;
}

export type OrderFailed = {
    order: Address;
    marketId: string;
    owner: Address;
    externalOrderId: string;
    orderId: Option<string>;
    status: OrderStatus;
    isBuy: boolean;
    isYes: boolean;
    requestedContracts: bigint;
    filledContracts: bigint;
    maxFillPriceUsd: bigint;
    avgFillPriceUsd: bigint;
    updatedBy: Address;
    timestamp: bigint;
    transferAmountToken: bigint;
};

function getOrderFailedDecoder() {
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
            ['requestedContracts', getU64Decoder()],
            ['filledContracts', getU64Decoder()],
            ['maxFillPriceUsd', getU64Decoder()],
            ['avgFillPriceUsd', getU64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
            ['transferAmountToken', getU64Decoder()],
        ]),
        [getConstantDecoder(ORDER_FAILED_DISCRIMINATOR)],
    );
}

export function parseOrderFailed(data: Uint8Array): OrderFailed {
    if (!ORDER_FAILED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('ORDERFAILED discriminator mismatch');
    }
    const decoded = getOrderFailedDecoder().decode(data);
    return decoded as OrderFailed;
}
