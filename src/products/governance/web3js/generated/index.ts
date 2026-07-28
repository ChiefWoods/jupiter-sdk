import { Address } from '@solana/web3.js';

export const GOVERN_PROGRAM_ID = new Address('GovaE4iu227srtG2s3tZzB4RmWBzw8sTwrCLZz7kN7rY');

export const MAXOPTION = 10;

export const ABSTAINVOTEINDEX = '0';

export const AGAINSTVOTEINDEX = '1';

export const FORVOTEINDEX = '2';

export * from './accounts/governor';
export * from './accounts/proposal';
export * from './accounts/proposalMeta';
export * from './accounts/optionProposalMeta';
export * from './accounts/vote';
export * from './instructions/createGovernor';
export * from './instructions/createProposal';
export * from './instructions/activateProposal';
export * from './instructions/cancelProposal';
export * from './instructions/queueProposal';
export * from './instructions/newVote';
export * from './instructions/setVote';
export * from './instructions/setGovernanceParams';
export * from './instructions/setVotingReward';
export * from './instructions/claimReward';
export * from './instructions/setLocker';
export * from './instructions/createProposalMeta';
export * from './instructions/createOptionProposalMeta';
export * from './types/votingReward';
export * from './types/governanceParameters';
export * from './types/proposalInstruction';
export * from './types/proposalAccountMeta';
export * from './types/proposalState';
export * from './types/proposalType';
