import { Address } from '@solana/web3.js';
import {
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getBooleanDecoder,
    getBooleanEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** Account metadata used to define Instructions */
export type ProposalAccountMeta = {
    /** An account's public key */
    pubkey: Address;
    /** True if an Instruction requires a Transaction signature matching `pubkey`. */
    isSigner: boolean;
    /** True if the `pubkey` can be loaded as a read-write account. */
    isWritable: boolean;
};

export type ProposalAccountMetaArgs = ProposalAccountMeta;

export function getProposalAccountMetaEncoder(): Encoder<ProposalAccountMetaArgs> {
    return getStructEncoder([
        ['pubkey', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['isSigner', getBooleanEncoder()],
        ['isWritable', getBooleanEncoder()],
    ]);
}

export function getProposalAccountMetaDecoder(): Decoder<ProposalAccountMeta> {
    return getStructDecoder([
        ['pubkey', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['isSigner', getBooleanDecoder()],
        ['isWritable', getBooleanDecoder()],
    ]);
}

export function getProposalAccountMetaCodec(): Codec<ProposalAccountMetaArgs, ProposalAccountMeta> {
    return combineCodec(getProposalAccountMetaEncoder(), getProposalAccountMetaDecoder());
}
