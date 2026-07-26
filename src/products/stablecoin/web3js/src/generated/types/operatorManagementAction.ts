import { OperatorRole, operatorRoleCodec } from '../types/operatorRole';
import { OperatorStatus, operatorStatusCodec } from '../types/operatorStatus';
import { getDiscriminatedUnionCodec, getStructCodec } from '@solana/codecs';

export type OperatorManagementAction =
    | { __kind: 'SetStatus'; status: OperatorStatus }
    | { __kind: 'SetRole'; role: OperatorRole }
    | { __kind: 'ClearRole'; role: OperatorRole };

export const operatorManagementActionCodec = getDiscriminatedUnionCodec([
    ['SetStatus', getStructCodec([['status', operatorStatusCodec]])],
    ['SetRole', getStructCodec([['role', operatorRoleCodec]])],
    ['ClearRole', getStructCodec([['role', operatorRoleCodec]])],
]);

// Data Enum Helpers.
type GetDiscriminatedUnionVariant<
    TUnion,
    TDiscriminator extends keyof TUnion,
    TKind extends TUnion[TDiscriminator],
> = Extract<TUnion, Record<TDiscriminator, TKind>>;

type GetDiscriminatedUnionVariantContent<
    TUnion,
    TDiscriminator extends keyof TUnion,
    TKind extends TUnion[TDiscriminator],
> = Omit<GetDiscriminatedUnionVariant<TUnion, TDiscriminator, TKind>, TDiscriminator>;

export function operatorManagementAction(
    kind: 'SetStatus',
    data: GetDiscriminatedUnionVariantContent<OperatorManagementAction, '__kind', 'SetStatus'>,
): GetDiscriminatedUnionVariant<OperatorManagementAction, '__kind', 'SetStatus'>;
export function operatorManagementAction(
    kind: 'SetRole',
    data: GetDiscriminatedUnionVariantContent<OperatorManagementAction, '__kind', 'SetRole'>,
): GetDiscriminatedUnionVariant<OperatorManagementAction, '__kind', 'SetRole'>;
export function operatorManagementAction(
    kind: 'ClearRole',
    data: GetDiscriminatedUnionVariantContent<OperatorManagementAction, '__kind', 'ClearRole'>,
): GetDiscriminatedUnionVariant<OperatorManagementAction, '__kind', 'ClearRole'>;
export function operatorManagementAction<K extends OperatorManagementAction['__kind'], Data>(kind: K, data?: Data) {
    if (Array.isArray(data)) {
        return { __kind: kind, fields: data };
    }
    return { __kind: kind, ...(data ?? {}) };
}

export function isOperatorManagementAction<K extends OperatorManagementAction['__kind']>(
    kind: K,
    value: OperatorManagementAction,
): value is OperatorManagementAction & { __kind: K } {
    return value.__kind === kind;
}
