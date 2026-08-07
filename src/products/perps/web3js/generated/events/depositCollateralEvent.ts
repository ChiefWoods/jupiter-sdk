import { Address } from '@solana/web3.js';
import {
    fixDecoderSize,
    getBytesDecoder,
    getConstantDecoder,
    getHiddenPrefixDecoder,
    getI64Decoder,
    getStructDecoder,
    getU64Decoder,
    transformDecoder,
} from '@solana/codecs';

export const DEPOSIT_COLLATERAL_DISCRIMINATOR = new Uint8Array([169, 14, 102, 148, 155, 137, 18, 235]);

export function getDepositCollateralEventDiscriminatorBytes(): Uint8Array {
    return DEPOSIT_COLLATERAL_DISCRIMINATOR;
}

export type DepositCollateral = {
    owner: Address;
    pool: Address;
    positionKey: Address;
    positionMint: Address;
    positionCustody: Address;
    depositAmount: bigint;
    userTokenAccount: Address;
    time: bigint;
};

function getDepositCollateralDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['depositAmount', getU64Decoder()],
            ['userTokenAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['time', getI64Decoder()],
        ]),
        [getConstantDecoder(DEPOSIT_COLLATERAL_DISCRIMINATOR)],
    );
}

export function parseDepositCollateral(data: Uint8Array): DepositCollateral {
    if (!DEPOSIT_COLLATERAL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('DEPOSITCOLLATERAL discriminator mismatch');
    }
    const decoded = getDepositCollateralDecoder().decode(data);
    return decoded as DepositCollateral;
}
