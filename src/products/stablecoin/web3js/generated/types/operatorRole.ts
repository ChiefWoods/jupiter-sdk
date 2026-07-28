import { combineCodec, getEnumDecoder, getEnumEncoder, type Codec, type Decoder, type Encoder } from '@solana/codecs';

export enum OperatorRole {
    Admin,
    PeriodManager,
    GlobalDisabler,
    VaultManager,
    VaultDisabler,
    BenefactorManager,
    BenefactorDisabler,
    PegManager,
    CollateralManager,
}

export type OperatorRoleArgs = OperatorRole;

export function getOperatorRoleEncoder(): Encoder<OperatorRoleArgs> {
    return getEnumEncoder(OperatorRole);
}

export function getOperatorRoleDecoder(): Decoder<OperatorRole> {
    return getEnumDecoder(OperatorRole);
}

export function getOperatorRoleCodec(): Codec<OperatorRoleArgs, OperatorRole> {
    return combineCodec(getOperatorRoleEncoder(), getOperatorRoleDecoder());
}
