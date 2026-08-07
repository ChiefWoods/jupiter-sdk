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

export const WITHDRAW_COLLATERAL_DISCRIMINATOR = new Uint8Array([145, 38, 46, 87, 190, 149, 253, 191]);

export function getWithdrawCollateralEventDiscriminatorBytes(): Uint8Array {
    return WITHDRAW_COLLATERAL_DISCRIMINATOR;
}

export type WithdrawCollateral = {
    owner: Address;
    pool: Address;
    positionKey: Address;
    positionMint: Address;
    positionCustody: Address;
    withdrawAmount: bigint;
    userTokenAccount: Address;
    custody: Address;
    previousCollateralAmount: bigint;
    collateralAmount: bigint;
    collateralAmountUsd: bigint;
    marginUsd: bigint;
    time: bigint;
};

function getWithdrawCollateralDecoder() {
    return getHiddenPrefixDecoder(
        getStructDecoder([
            ['owner', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['pool', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionKey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionMint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['positionCustody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['withdrawAmount', getU64Decoder()],
            ['userTokenAccount', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['custody', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
            ['previousCollateralAmount', getU64Decoder()],
            ['collateralAmount', getU64Decoder()],
            ['collateralAmountUsd', getU64Decoder()],
            ['marginUsd', getU64Decoder()],
            ['time', getI64Decoder()],
        ]),
        [getConstantDecoder(WITHDRAW_COLLATERAL_DISCRIMINATOR)],
    );
}

export function parseWithdrawCollateral(data: Uint8Array): WithdrawCollateral {
    if (!WITHDRAW_COLLATERAL_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) {
        throw new Error('WITHDRAWCOLLATERAL discriminator mismatch');
    }
    const decoded = getWithdrawCollateralDecoder().decode(data);
    return decoded as WithdrawCollateral;
}
