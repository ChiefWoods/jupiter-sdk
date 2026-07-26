import { getI64Codec, getStructCodec, getU64Codec } from '@solana/codecs';

export interface GovernanceParameters {
    votingDelay: bigint;
    votingPeriod: bigint;
    quorumVotes: bigint;
    timelockDelaySeconds: bigint;
}

export const governanceParametersCodec = getStructCodec([
    ['votingDelay', getU64Codec()],
    ['votingPeriod', getU64Codec()],
    ['quorumVotes', getU64Codec()],
    ['timelockDelaySeconds', getI64Codec()],
]);
