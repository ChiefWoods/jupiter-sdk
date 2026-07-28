import {
    combineCodec,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Codec,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

/** Governance parameters. */
export type GovernanceParameters = {
    /** The delay before voting on a proposal may take place, once proposed, in seconds */
    votingDelay: bigint;
    /** The duration of voting on a proposal, in seconds */
    votingPeriod: bigint;
    /** The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed */
    quorumVotes: bigint;
    /** The timelock delay of the DAO's created proposals. */
    timelockDelaySeconds: bigint;
};

export type GovernanceParametersArgs = {
    /** The delay before voting on a proposal may take place, once proposed, in seconds */
    votingDelay: number | bigint;
    /** The duration of voting on a proposal, in seconds */
    votingPeriod: number | bigint;
    /** The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed */
    quorumVotes: number | bigint;
    /** The timelock delay of the DAO's created proposals. */
    timelockDelaySeconds: number | bigint;
};

export function getGovernanceParametersEncoder(): Encoder<GovernanceParametersArgs> {
    return getStructEncoder([
        ['votingDelay', getU64Encoder()],
        ['votingPeriod', getU64Encoder()],
        ['quorumVotes', getU64Encoder()],
        ['timelockDelaySeconds', getI64Encoder()],
    ]);
}

export function getGovernanceParametersDecoder(): Decoder<GovernanceParameters> {
    return getStructDecoder([
        ['votingDelay', getU64Decoder()],
        ['votingPeriod', getU64Decoder()],
        ['quorumVotes', getU64Decoder()],
        ['timelockDelaySeconds', getI64Decoder()],
    ]);
}

export function getGovernanceParametersCodec(): Codec<GovernanceParametersArgs, GovernanceParameters> {
    return combineCodec(getGovernanceParametersEncoder(), getGovernanceParametersDecoder());
}
