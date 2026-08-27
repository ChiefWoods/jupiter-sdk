import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU128Decoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const REPAY_TO_CUSTODY_DISCRIMINATOR = new Uint8Array([232, 54, 116, 175, 186, 24, 249, 221]);

export function getRepayToCustodyEventDiscriminatorBytes(): Uint8Array {
    return REPAY_TO_CUSTODY_DISCRIMINATOR;
}

export type RepayToCustody = {
    owner: Address;
    pool: Address;
    positionKey: Address;
    positionMint: Address;
    positionCustody: Address;
    sizeCustodyToken: bigint;
    updateTime: bigint;
    interest: bigint;
};

function getRepayToCustodyDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['sizeCustodyToken', getU64Decoder()],
            ['updateTime', getI64Decoder()],
            ['interest', getU128Decoder()],
        ]),
        [getConstantDecoder(REPAY_TO_CUSTODY_DISCRIMINATOR)],
    );
}

export function parseRepayToCustody(data: Uint8Array): RepayToCustody {
    if (!REPAY_TO_CUSTODY_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('RepayToCustody discriminator mismatch');
    }
    const decoded = getRepayToCustodyDecoder().decode(data);
    return decoded as RepayToCustody;
}
