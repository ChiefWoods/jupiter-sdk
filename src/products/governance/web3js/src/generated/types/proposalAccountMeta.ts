import { Address } from '@solana/web3.js';
import { fixCodecSize, getBooleanCodec, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface ProposalAccountMeta {
    pubkey: Address;
    isSigner: boolean;
    isWritable: boolean;
}

export const proposalAccountMetaCodec = getStructCodec([
    [
        'pubkey',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['isSigner', getBooleanCodec()],
    ['isWritable', getBooleanCodec()],
]);
