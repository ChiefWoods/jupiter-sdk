export const LOCK_ERROR__MATH_OVERFLOW = 0x1770; // 6000
export const LOCK_ERROR__FREQUENCY_IS_ZERO = 0x1771; // 6001
export const LOCK_ERROR__INVALID_ESCROW_TOKEN_ADDRESS = 0x1772; // 6002
export const LOCK_ERROR__INVALID_UPDATE_RECIPIENT_MODE = 0x1773; // 6003
export const LOCK_ERROR__INVALID_CANCEL_MODE = 0x1774; // 6004
export const LOCK_ERROR__NOT_PERMIT_TO_DO_THIS_ACTION = 0x1775; // 6005
export const LOCK_ERROR__INVALID_RECIPIENT_TOKEN_ACCOUNT = 0x1776; // 6006
export const LOCK_ERROR__INVALID_CREATOR_TOKEN_ACCOUNT = 0x1777; // 6007
export const LOCK_ERROR__INVALID_ESCROW_METADATA = 0x1778; // 6008
export const LOCK_ERROR__INVALID_VESTING_START_TIME = 0x1779; // 6009
export const LOCK_ERROR__ALREADY_CANCELLED = 0x177a; // 6010
export const LOCK_ERROR__CANCELLED_AT_IS_ZERO = 0x177b; // 6011
export const LOCK_ERROR__INCORRECT_TOKEN_PROGRAM_ID = 0x177c; // 6012
export const LOCK_ERROR__TRANSFER_FEE_CALCULATION_FAILURE = 0x177d; // 6013
export const LOCK_ERROR__UNSUPPORTED_MINT = 0x177e; // 6014
export const LOCK_ERROR__INVALID_REMAINING_ACCOUNT_SLICE = 0x177f; // 6015
export const LOCK_ERROR__INSUFFICIENT_REMAINING_ACCOUNTS = 0x1780; // 6016
export const LOCK_ERROR__DUPLICATED_REMAINING_ACCOUNT_TYPES = 0x1781; // 6017
export const LOCK_ERROR__NO_TRANSFER_HOOK_PROGRAM = 0x1782; // 6018
export const LOCK_ERROR__CLAIMING_IS_NOT_FINISHED = 0x1783; // 6019
export const LOCK_ERROR__INVALID_MERKLE_PROOF = 0x1784; // 6020
export const LOCK_ERROR__ESCROW_NOT_CANCELLED = 0x1785; // 6021
export const LOCK_ERROR__AMOUNT_IS_ZERO = 0x1786; // 6022
export const LOCK_ERROR__INVALID_PARAMS = 0x1787; // 6023

export type LockError =
    | typeof LOCK_ERROR__ALREADY_CANCELLED
    | typeof LOCK_ERROR__AMOUNT_IS_ZERO
    | typeof LOCK_ERROR__CANCELLED_AT_IS_ZERO
    | typeof LOCK_ERROR__CLAIMING_IS_NOT_FINISHED
    | typeof LOCK_ERROR__DUPLICATED_REMAINING_ACCOUNT_TYPES
    | typeof LOCK_ERROR__ESCROW_NOT_CANCELLED
    | typeof LOCK_ERROR__FREQUENCY_IS_ZERO
    | typeof LOCK_ERROR__INCORRECT_TOKEN_PROGRAM_ID
    | typeof LOCK_ERROR__INSUFFICIENT_REMAINING_ACCOUNTS
    | typeof LOCK_ERROR__INVALID_CANCEL_MODE
    | typeof LOCK_ERROR__INVALID_CREATOR_TOKEN_ACCOUNT
    | typeof LOCK_ERROR__INVALID_ESCROW_METADATA
    | typeof LOCK_ERROR__INVALID_ESCROW_TOKEN_ADDRESS
    | typeof LOCK_ERROR__INVALID_MERKLE_PROOF
    | typeof LOCK_ERROR__INVALID_PARAMS
    | typeof LOCK_ERROR__INVALID_RECIPIENT_TOKEN_ACCOUNT
    | typeof LOCK_ERROR__INVALID_REMAINING_ACCOUNT_SLICE
    | typeof LOCK_ERROR__INVALID_UPDATE_RECIPIENT_MODE
    | typeof LOCK_ERROR__INVALID_VESTING_START_TIME
    | typeof LOCK_ERROR__MATH_OVERFLOW
    | typeof LOCK_ERROR__NOT_PERMIT_TO_DO_THIS_ACTION
    | typeof LOCK_ERROR__NO_TRANSFER_HOOK_PROGRAM
    | typeof LOCK_ERROR__TRANSFER_FEE_CALCULATION_FAILURE
    | typeof LOCK_ERROR__UNSUPPORTED_MINT;

export interface LockErrorInfo {
    code: LockError;
    name: string;
    message: string;
}

const LOCK_ERRORS: Readonly<Record<LockError, LockErrorInfo>> = {
    [LOCK_ERROR__MATH_OVERFLOW]: { code: 6000, name: 'mathOverflow', message: 'Math operation overflow' },
    [LOCK_ERROR__FREQUENCY_IS_ZERO]: { code: 6001, name: 'frequencyIsZero', message: 'Frequency is zero' },
    [LOCK_ERROR__INVALID_ESCROW_TOKEN_ADDRESS]: {
        code: 6002,
        name: 'invalidEscrowTokenAddress',
        message: 'Invalid escrow token address',
    },
    [LOCK_ERROR__INVALID_UPDATE_RECIPIENT_MODE]: {
        code: 6003,
        name: 'invalidUpdateRecipientMode',
        message: 'Invalid update recipient mode',
    },
    [LOCK_ERROR__INVALID_CANCEL_MODE]: { code: 6004, name: 'invalidCancelMode', message: 'Invalid cancel mode' },
    [LOCK_ERROR__NOT_PERMIT_TO_DO_THIS_ACTION]: {
        code: 6005,
        name: 'notPermitToDoThisAction',
        message: 'Not permit to do this action',
    },
    [LOCK_ERROR__INVALID_RECIPIENT_TOKEN_ACCOUNT]: {
        code: 6006,
        name: 'invalidRecipientTokenAccount',
        message: 'Invalid recipient token account',
    },
    [LOCK_ERROR__INVALID_CREATOR_TOKEN_ACCOUNT]: {
        code: 6007,
        name: 'invalidCreatorTokenAccount',
        message: 'Invalid creator token account',
    },
    [LOCK_ERROR__INVALID_ESCROW_METADATA]: {
        code: 6008,
        name: 'invalidEscrowMetadata',
        message: 'Invalid escrow metadata',
    },
    [LOCK_ERROR__INVALID_VESTING_START_TIME]: {
        code: 6009,
        name: 'invalidVestingStartTime',
        message: 'Invalid vesting start time',
    },
    [LOCK_ERROR__ALREADY_CANCELLED]: { code: 6010, name: 'alreadyCancelled', message: 'Already cancelled' },
    [LOCK_ERROR__CANCELLED_AT_IS_ZERO]: {
        code: 6011,
        name: 'cancelledAtIsZero',
        message: 'Cancelled timestamp is zero',
    },
    [LOCK_ERROR__INCORRECT_TOKEN_PROGRAM_ID]: {
        code: 6012,
        name: 'incorrectTokenProgramId',
        message: 'Invalid token program ID',
    },
    [LOCK_ERROR__TRANSFER_FEE_CALCULATION_FAILURE]: {
        code: 6013,
        name: 'transferFeeCalculationFailure',
        message: 'Calculate transfer fee failure',
    },
    [LOCK_ERROR__UNSUPPORTED_MINT]: { code: 6014, name: 'unsupportedMint', message: 'Unsupported mint' },
    [LOCK_ERROR__INVALID_REMAINING_ACCOUNT_SLICE]: {
        code: 6015,
        name: 'invalidRemainingAccountSlice',
        message: 'Invalid remaining accounts',
    },
    [LOCK_ERROR__INSUFFICIENT_REMAINING_ACCOUNTS]: {
        code: 6016,
        name: 'insufficientRemainingAccounts',
        message: 'Insufficient remaining accounts',
    },
    [LOCK_ERROR__DUPLICATED_REMAINING_ACCOUNT_TYPES]: {
        code: 6017,
        name: 'duplicatedRemainingAccountTypes',
        message: 'Same accounts type is provided more than once',
    },
    [LOCK_ERROR__NO_TRANSFER_HOOK_PROGRAM]: {
        code: 6018,
        name: 'noTransferHookProgram',
        message: 'Missing remaining accounts for transfer hook.',
    },
    [LOCK_ERROR__CLAIMING_IS_NOT_FINISHED]: {
        code: 6019,
        name: 'claimingIsNotFinished',
        message: 'Claiming is not finished',
    },
    [LOCK_ERROR__INVALID_MERKLE_PROOF]: { code: 6020, name: 'invalidMerkleProof', message: 'Invalid merkle proof' },
    [LOCK_ERROR__ESCROW_NOT_CANCELLED]: { code: 6021, name: 'escrowNotCancelled', message: 'Escrow is not cancelled' },
    [LOCK_ERROR__AMOUNT_IS_ZERO]: { code: 6022, name: 'amountIsZero', message: 'Amount is zero' },
    [LOCK_ERROR__INVALID_PARAMS]: { code: 6023, name: 'invalidParams', message: 'Invalid params' },
};

export function getLockErrorFromCode(code: number): LockErrorInfo | undefined {
    return LOCK_ERRORS[code as LockError];
}

export function getLockErrorMessage(code: LockError): string {
    return LOCK_ERRORS[code].message;
}
