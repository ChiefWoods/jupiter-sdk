import { Address } from '@solana/web3.js';
import { ProposalAccountMeta, proposalAccountMetaCodec } from '../types/proposalAccountMeta';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    transformCodec,
} from '@solana/codecs';

export interface ProposalInstruction {
    programId: Address;
    keys: Array<ProposalAccountMeta>;
    data: Uint8Array;
}

export const proposalInstructionCodec = getStructCodec([
    [
        'programId',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['keys', getArrayCodec(proposalAccountMetaCodec)],
    ['data', addCodecSizePrefix(getBytesCodec(), getU32Codec())],
]);
