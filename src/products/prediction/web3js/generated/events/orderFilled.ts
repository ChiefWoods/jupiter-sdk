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

export const ORDER_FILLED_DISCRIMINATOR = new Uint8Array([120, 124, 109, 66, 249, 116, 174, 30]);

export function getOrderFilledDiscriminatorBytes(): Uint8Array {
    return ORDER_FILLED_DISCRIMINATOR;
}

export type OrderFilled = {
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
    totalCostUsd: bigint;
    grossProceedsUsd: bigint;
    netProceedsUsd: bigint;
    transferAmountToken: bigint;
    feeUsd: bigint;
    integratorFeeUsd: bigint;
    integrator: Address;
    realizedPnlUsd: bigint;
    updatedBy: Address;
    timestamp: bigint;
};

function getOrderFilledDecoder() {
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
            ['totalCostUsd', getU64Decoder()],
            ['grossProceedsUsd', getU64Decoder()],
            ['netProceedsUsd', getU64Decoder()],
            ['transferAmountToken', getU64Decoder()],
            ['feeUsd', getU64Decoder()],
            ['integratorFeeUsd', getU64Decoder()],
            ['integrator', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['realizedPnlUsd', getI64Decoder()],
            ['updatedBy', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['timestamp', getI64Decoder()],
        ]),
        [getConstantDecoder(ORDER_FILLED_DISCRIMINATOR)],
    );
}

export function parseOrderFilled(data: Uint8Array): OrderFilled {
    if (!ORDER_FILLED_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('OrderFilled discriminator mismatch');
    }
    const decoded = getOrderFilledDecoder().decode(data);
    return decoded as OrderFilled;
}
