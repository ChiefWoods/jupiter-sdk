import { Address } from '@solana/web3.js';
import {
    addDecoderSizePrefix,
    addEncoderSizePrefix,
    combineCodec,
    fixDecoderSize,
    fixEncoderSize,
    getArrayDecoder,
    getArrayEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    transformDecoder,
    transformEncoder,
    type Codec,
    type Decoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getProposalAccountMetaDecoder,
    getProposalAccountMetaEncoder,
    type ProposalAccountMeta,
    type ProposalAccountMetaArgs,
} from '../types/proposalAccountMeta';

/** Instruction. */
export type ProposalInstruction = {
    /** Pubkey of the instruction processor that executes this instruction */
    programId: Address;
    /** Metadata for what accounts should be passed to the instruction processor */
    keys: Array<ProposalAccountMeta>;
    /** Opaque data passed to the instruction processor */
    data: ReadonlyUint8Array;
};

export type ProposalInstructionArgs = {
    /** Pubkey of the instruction processor that executes this instruction */
    programId: Address;
    /** Metadata for what accounts should be passed to the instruction processor */
    keys: Array<ProposalAccountMetaArgs>;
    /** Opaque data passed to the instruction processor */
    data: ReadonlyUint8Array;
};

export function getProposalInstructionEncoder(): Encoder<ProposalInstructionArgs> {
    return getStructEncoder([
        ['programId', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['keys', getArrayEncoder(getProposalAccountMetaEncoder())],
        ['data', addEncoderSizePrefix(getBytesEncoder(), getU32Encoder())],
    ]);
}

export function getProposalInstructionDecoder(): Decoder<ProposalInstruction> {
    return getStructDecoder([
        ['programId', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['keys', getArrayDecoder(getProposalAccountMetaDecoder())],
        ['data', addDecoderSizePrefix(getBytesDecoder(), getU32Decoder())],
    ]);
}

export function getProposalInstructionCodec(): Codec<ProposalInstructionArgs, ProposalInstruction> {
    return combineCodec(getProposalInstructionEncoder(), getProposalInstructionDecoder());
}
