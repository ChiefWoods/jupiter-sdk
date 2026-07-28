import {
    combineCodec,
    getDiscriminatedUnionDecoder,
    getDiscriminatedUnionEncoder,
    getStructDecoder,
    getStructEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type GetDiscriminatedUnionVariant,
    type GetDiscriminatedUnionVariantContent,
} from '@solana/codecs';
import {
    getOperatorRoleDecoder,
    getOperatorRoleEncoder,
    type OperatorRole,
    type OperatorRoleArgs,
} from '../types/operatorRole';
import {
    getOperatorStatusDecoder,
    getOperatorStatusEncoder,
    type OperatorStatus,
    type OperatorStatusArgs,
} from '../types/operatorStatus';

export type OperatorManagementAction =
    | { __kind: 'SetStatus'; status: OperatorStatus }
    | { __kind: 'SetRole'; role: OperatorRole }
    | { __kind: 'ClearRole'; role: OperatorRole };

export type OperatorManagementActionArgs =
    | { __kind: 'SetStatus'; status: OperatorStatusArgs }
    | { __kind: 'SetRole'; role: OperatorRoleArgs }
    | { __kind: 'ClearRole'; role: OperatorRoleArgs };

export function getOperatorManagementActionEncoder(): Encoder<OperatorManagementActionArgs> {
    return getDiscriminatedUnionEncoder([
        ['SetStatus', getStructEncoder([['status', getOperatorStatusEncoder()]])],
        ['SetRole', getStructEncoder([['role', getOperatorRoleEncoder()]])],
        ['ClearRole', getStructEncoder([['role', getOperatorRoleEncoder()]])],
    ]);
}

export function getOperatorManagementActionDecoder(): Decoder<OperatorManagementAction> {
    return getDiscriminatedUnionDecoder([
        ['SetStatus', getStructDecoder([['status', getOperatorStatusDecoder()]])],
        ['SetRole', getStructDecoder([['role', getOperatorRoleDecoder()]])],
        ['ClearRole', getStructDecoder([['role', getOperatorRoleDecoder()]])],
    ]);
}

export function getOperatorManagementActionCodec(): Codec<OperatorManagementActionArgs, OperatorManagementAction> {
    return combineCodec(getOperatorManagementActionEncoder(), getOperatorManagementActionDecoder());
}

// Data Enum Helpers.
export function operatorManagementAction(
    kind: 'SetStatus',
    data: GetDiscriminatedUnionVariantContent<OperatorManagementActionArgs, '__kind', 'SetStatus'>,
): GetDiscriminatedUnionVariant<OperatorManagementActionArgs, '__kind', 'SetStatus'>;
export function operatorManagementAction(
    kind: 'SetRole',
    data: GetDiscriminatedUnionVariantContent<OperatorManagementActionArgs, '__kind', 'SetRole'>,
): GetDiscriminatedUnionVariant<OperatorManagementActionArgs, '__kind', 'SetRole'>;
export function operatorManagementAction(
    kind: 'ClearRole',
    data: GetDiscriminatedUnionVariantContent<OperatorManagementActionArgs, '__kind', 'ClearRole'>,
): GetDiscriminatedUnionVariant<OperatorManagementActionArgs, '__kind', 'ClearRole'>;
export function operatorManagementAction<K extends OperatorManagementActionArgs['__kind'], Data>(kind: K, data?: Data) {
    return Array.isArray(data) ? { __kind: kind, fields: data } : { __kind: kind, ...(data ?? {}) };
}

export function isOperatorManagementAction<K extends OperatorManagementAction['__kind']>(
    kind: K,
    value: OperatorManagementAction,
): value is OperatorManagementAction & { __kind: K } {
    return value.__kind === kind;
}
