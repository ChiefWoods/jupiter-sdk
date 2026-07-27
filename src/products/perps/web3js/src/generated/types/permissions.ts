import {
    combineCodec,
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export type Permissions = {
    allowSwap: boolean;
    allowAddLiquidity: boolean;
    allowRemoveLiquidity: boolean;
    allowIncreasePosition: boolean;
    allowDecreasePosition: boolean;
    allowCollateralWithdrawal: boolean;
    allowLiquidatePosition: boolean;
};

export type PermissionsArgs = Permissions;

export function getPermissionsEncoder(): Encoder<PermissionsArgs> {
    return getStructEncoder([
        ['allowSwap', getBooleanEncoder()],
        ['allowAddLiquidity', getBooleanEncoder()],
        ['allowRemoveLiquidity', getBooleanEncoder()],
        ['allowIncreasePosition', getBooleanEncoder()],
        ['allowDecreasePosition', getBooleanEncoder()],
        ['allowCollateralWithdrawal', getBooleanEncoder()],
        ['allowLiquidatePosition', getBooleanEncoder()],
    ]);
}

export function getPermissionsDecoder(): Decoder<Permissions> {
    return getStructDecoder([
        ['allowSwap', getBooleanDecoder()],
        ['allowAddLiquidity', getBooleanDecoder()],
        ['allowRemoveLiquidity', getBooleanDecoder()],
        ['allowIncreasePosition', getBooleanDecoder()],
        ['allowDecreasePosition', getBooleanDecoder()],
        ['allowCollateralWithdrawal', getBooleanDecoder()],
        ['allowLiquidatePosition', getBooleanDecoder()],
    ]);
}

export function getPermissionsCodec(): Codec<PermissionsArgs, Permissions> {
    return combineCodec(getPermissionsEncoder(), getPermissionsDecoder());
}
