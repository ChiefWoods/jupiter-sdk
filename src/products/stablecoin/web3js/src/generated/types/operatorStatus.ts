import { getU8Codec } from '@solana/codecs';

export enum OperatorStatus {
    Enabled,
    Disabled,
}

export const operatorStatusCodec = getU8Codec();
