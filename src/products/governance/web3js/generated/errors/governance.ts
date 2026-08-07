export const GOVERNANCE_ERROR__INVALID_VOTE_SIDE = 0x1770; // 6000
export const GOVERNANCE_ERROR__INVALID_PROPOSAL_TYPE = 0x1771; // 6001
export const GOVERNANCE_ERROR__GOVERNOR_NOT_FOUND = 0x1772; // 6002
export const GOVERNANCE_ERROR__VOTING_DELAY_NOT_MET = 0x1773; // 6003
export const GOVERNANCE_ERROR__PROPOSAL_NOT_DRAFT = 0x1774; // 6004
export const GOVERNANCE_ERROR__PROPOSAL_NOT_ACTIVE = 0x1775; // 6005
export const GOVERNANCE_ERROR__INVALID_MAX_OPTION = 0x1776; // 6006
export const GOVERNANCE_ERROR__NOT_YES_NO_PROPOSAL = 0x1777; // 6007
export const GOVERNANCE_ERROR__NOT_OPTION_PROPOSAL = 0x1778; // 6008
export const GOVERNANCE_ERROR__INVALID_OPTION_DESCRIPTIONS = 0x1779; // 6009

export type GovernanceError =
    | typeof GOVERNANCE_ERROR__GOVERNOR_NOT_FOUND
    | typeof GOVERNANCE_ERROR__INVALID_MAX_OPTION
    | typeof GOVERNANCE_ERROR__INVALID_OPTION_DESCRIPTIONS
    | typeof GOVERNANCE_ERROR__INVALID_PROPOSAL_TYPE
    | typeof GOVERNANCE_ERROR__INVALID_VOTE_SIDE
    | typeof GOVERNANCE_ERROR__NOT_OPTION_PROPOSAL
    | typeof GOVERNANCE_ERROR__NOT_YES_NO_PROPOSAL
    | typeof GOVERNANCE_ERROR__PROPOSAL_NOT_ACTIVE
    | typeof GOVERNANCE_ERROR__PROPOSAL_NOT_DRAFT
    | typeof GOVERNANCE_ERROR__VOTING_DELAY_NOT_MET;

export interface GovernanceErrorInfo {
    code: GovernanceError;
    name: string;
    message: string;
}

const GOVERNANCE_ERRORS: Readonly<Record<GovernanceError, GovernanceErrorInfo>> = {
    [GOVERNANCE_ERROR__INVALID_VOTE_SIDE]: { code: 6000, name: 'invalidVoteSide', message: 'Invalid vote side.' },
    [GOVERNANCE_ERROR__INVALID_PROPOSAL_TYPE]: {
        code: 6001,
        name: 'invalidProposalType',
        message: 'Invalid proposal type.',
    },
    [GOVERNANCE_ERROR__GOVERNOR_NOT_FOUND]: {
        code: 6002,
        name: 'governorNotFound',
        message: "The owner of the smart wallet doesn't match with current.",
    },
    [GOVERNANCE_ERROR__VOTING_DELAY_NOT_MET]: {
        code: 6003,
        name: 'votingDelayNotMet',
        message: 'The proposal cannot be activated since it has not yet passed the voting delay.',
    },
    [GOVERNANCE_ERROR__PROPOSAL_NOT_DRAFT]: {
        code: 6004,
        name: 'proposalNotDraft',
        message: 'Only drafts can be canceled.',
    },
    [GOVERNANCE_ERROR__PROPOSAL_NOT_ACTIVE]: {
        code: 6005,
        name: 'proposalNotActive',
        message: 'The proposal must be active.',
    },
    [GOVERNANCE_ERROR__INVALID_MAX_OPTION]: { code: 6006, name: 'invalidMaxOption', message: 'Max option is invalid' },
    [GOVERNANCE_ERROR__NOT_YES_NO_PROPOSAL]: {
        code: 6007,
        name: 'notYesNoProposal',
        message: 'Proposal is not YesNo.',
    },
    [GOVERNANCE_ERROR__NOT_OPTION_PROPOSAL]: {
        code: 6008,
        name: 'notOptionProposal',
        message: 'Proposal is not Option.',
    },
    [GOVERNANCE_ERROR__INVALID_OPTION_DESCRIPTIONS]: {
        code: 6009,
        name: 'invalidOptionDescriptions',
        message: 'Invalid option descriptions.',
    },
};

export function getGovernanceErrorFromCode(code: number): GovernanceErrorInfo | undefined {
    return GOVERNANCE_ERRORS[code as GovernanceError];
}

export function getGovernanceErrorMessage(code: GovernanceError): string {
    return GOVERNANCE_ERRORS[code].message;
}
