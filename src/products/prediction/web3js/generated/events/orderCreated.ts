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
    getU16Decoder,
    getU32Decoder,
    getU64Decoder,
    getUtf8Decoder,
    transformDecoder,
    type Option,
} from '@solana/codecs';
import { getOrderTypeDecoder, type OrderType } from '../types/orderType';

export const ORDER_CREATED_DISCRIMINATOR = new Uint8Array([224, 1, 229, 63, 254, 60, 190, 159]);

export function getOrderCreatedDiscriminatorBytes(): Uint8Array {
    return ORDER_CREATED_DISCRIMINATOR;
}

export type OrderCreated = {
    order: Address;
    marketId: string;
    owner: Address;
    orderId: Option<string>;
    externalOrderId: string;
    isYes: boolean;
    isBuy: boolean;
    contracts: bigint;
    maxFillPriceUsd: bigint;
    depositAmount: bigint;
    orderType: OrderType;
    integrator: Address;
    integratorFeeBps: number;
    timestamp: bigint;
};

function getOrderCreatedDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['order', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['marketId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['orderId', getOptionDecoder(addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder()))],
            ['externalOrderId', addDecoderSizePrefix(getUtf8Decoder(), getU32Decoder())],
            ['isYes', getBooleanDecoder()],
            ['isBuy', getBooleanDecoder()],
            ['contracts', getU64Decoder()],
            ['maxFillPriceUsd', getU64Decoder()],
            ['depositAmount', getU64Decoder()],
            ['orderType', getOrderTypeDecoder()],
            ['integrator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['integratorFeeBps', getU16Decoder()],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(ORDER_CREATED_DISCRIMINATOR)],
    );
}

export function parseOrderCreated(data: Uint8Array): OrderCreated {
    if (!ORDER_CREATED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OrderCreated discriminator mismatch');
    }
    const decoded = getOrderCreatedDecoder().decode(data);
    return decoded as OrderCreated;
}
