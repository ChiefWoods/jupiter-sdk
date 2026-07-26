import { getU8Codec } from '@solana/codecs';

export enum AccountsType {
    TransferHookEscrow,
}

export const accountsTypeCodec = getU8Codec();
