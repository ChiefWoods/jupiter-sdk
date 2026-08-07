export const REWARDS_HUB_ERROR__UNAUTHORIZED = 0x1770; // 6000
export const REWARDS_HUB_ERROR__OWNER_MISMATCH = 0x1771; // 6001
export const REWARDS_HUB_ERROR__CLAWBACK_BEFORE_END = 0x1772; // 6002
export const REWARDS_HUB_ERROR__SAME_CLAWBACK_RECEIVER = 0x1773; // 6003
export const REWARDS_HUB_ERROR__SAME_ADMIN = 0x1774; // 6004
export const REWARDS_HUB_ERROR__CLAIM_EXPIRED = 0x1775; // 6005
export const REWARDS_HUB_ERROR__ARITHMETIC_ERROR = 0x1776; // 6006
export const REWARDS_HUB_ERROR__START_TIMESTAMP_AFTER_END = 0x1777; // 6007
export const REWARDS_HUB_ERROR__TIMESTAMPS_NOT_IN_FUTURE = 0x1778; // 6008
export const REWARDS_HUB_ERROR__CLAIMING_IS_NOT_STARTED = 0x1779; // 6009
export const REWARDS_HUB_ERROR__INVALID_CLAIM_AMOUNT = 0x177a; // 6010
export const REWARDS_HUB_ERROR__INVALID_LOOTBOX_AMOUNT = 0x177b; // 6011
export const REWARDS_HUB_ERROR__CAMPAIGN_NOT_ENDED = 0x177c; // 6012
export const REWARDS_HUB_ERROR__SIG_VERIFICATION_FAILED = 0x177d; // 6013

export type RewardsHubError =
    | typeof REWARDS_HUB_ERROR__ARITHMETIC_ERROR
    | typeof REWARDS_HUB_ERROR__CAMPAIGN_NOT_ENDED
    | typeof REWARDS_HUB_ERROR__CLAIM_EXPIRED
    | typeof REWARDS_HUB_ERROR__CLAIMING_IS_NOT_STARTED
    | typeof REWARDS_HUB_ERROR__CLAWBACK_BEFORE_END
    | typeof REWARDS_HUB_ERROR__INVALID_CLAIM_AMOUNT
    | typeof REWARDS_HUB_ERROR__INVALID_LOOTBOX_AMOUNT
    | typeof REWARDS_HUB_ERROR__OWNER_MISMATCH
    | typeof REWARDS_HUB_ERROR__SAME_ADMIN
    | typeof REWARDS_HUB_ERROR__SAME_CLAWBACK_RECEIVER
    | typeof REWARDS_HUB_ERROR__SIG_VERIFICATION_FAILED
    | typeof REWARDS_HUB_ERROR__START_TIMESTAMP_AFTER_END
    | typeof REWARDS_HUB_ERROR__TIMESTAMPS_NOT_IN_FUTURE
    | typeof REWARDS_HUB_ERROR__UNAUTHORIZED;

export interface RewardsHubErrorInfo {
    code: RewardsHubError;
    name: string;
    message: string;
}

const REWARDSHUB_ERRORS: Readonly<Record<RewardsHubError, RewardsHubErrorInfo>> = {
    [REWARDS_HUB_ERROR__UNAUTHORIZED]: {
        code: 6000,
        name: 'unauthorized',
        message: 'Account is not authorized to execute this instruction',
    },
    [REWARDS_HUB_ERROR__OWNER_MISMATCH]: {
        code: 6001,
        name: 'ownerMismatch',
        message: 'Token account owner did not match intended owner',
    },
    [REWARDS_HUB_ERROR__CLAWBACK_BEFORE_END]: {
        code: 6002,
        name: 'clawbackBeforeEnd',
        message: 'Attempted clawback before end of campaign',
    },
    [REWARDS_HUB_ERROR__SAME_CLAWBACK_RECEIVER]: {
        code: 6003,
        name: 'sameClawbackReceiver',
        message: 'New and old Clawback receivers are identical',
    },
    [REWARDS_HUB_ERROR__SAME_ADMIN]: { code: 6004, name: 'sameAdmin', message: 'New and old admin are identical' },
    [REWARDS_HUB_ERROR__CLAIM_EXPIRED]: { code: 6005, name: 'claimExpired', message: 'Claim window expired' },
    [REWARDS_HUB_ERROR__ARITHMETIC_ERROR]: {
        code: 6006,
        name: 'arithmeticError',
        message: 'Arithmetic Error (overflow/underflow)',
    },
    [REWARDS_HUB_ERROR__START_TIMESTAMP_AFTER_END]: {
        code: 6007,
        name: 'startTimestampAfterEnd',
        message: 'Start Timestamp cannot be after end Timestamp',
    },
    [REWARDS_HUB_ERROR__TIMESTAMPS_NOT_IN_FUTURE]: {
        code: 6008,
        name: 'timestampsNotInFuture',
        message: 'Timestamps cannot be in the past',
    },
    [REWARDS_HUB_ERROR__CLAIMING_IS_NOT_STARTED]: {
        code: 6009,
        name: 'claimingIsNotStarted',
        message: 'Claiming is not started',
    },
    [REWARDS_HUB_ERROR__INVALID_CLAIM_AMOUNT]: {
        code: 6010,
        name: 'invalidClaimAmount',
        message: 'Invalid claim amount',
    },
    [REWARDS_HUB_ERROR__INVALID_LOOTBOX_AMOUNT]: {
        code: 6011,
        name: 'invalidLootboxAmount',
        message: 'Invalid lootbox amount',
    },
    [REWARDS_HUB_ERROR__CAMPAIGN_NOT_ENDED]: {
        code: 6012,
        name: 'campaignNotEnded',
        message: 'Campaign not yet ended',
    },
    [REWARDS_HUB_ERROR__SIG_VERIFICATION_FAILED]: {
        code: 6013,
        name: 'sigVerificationFailed',
        message: 'Signature verification failed',
    },
};

export function getRewardsHubErrorFromCode(code: number): RewardsHubErrorInfo | undefined {
    return REWARDSHUB_ERRORS[code as RewardsHubError];
}

export function getRewardsHubErrorMessage(code: RewardsHubError): string {
    return REWARDSHUB_ERRORS[code].message;
}
