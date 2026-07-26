import { getU8Codec } from '@solana/codecs';

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

export const operatorRoleCodec = getU8Codec();
