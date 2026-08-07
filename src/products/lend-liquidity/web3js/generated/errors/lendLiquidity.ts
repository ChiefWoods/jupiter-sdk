export const LEND_LIQUIDITY_ERROR__USER_CLASS_NOT_PAUSABLE = 0x1770; // 6000
export const LEND_LIQUIDITY_ERROR__USER_CLASS_NOT_FOUND = 0x1771; // 6001
export const LEND_LIQUIDITY_ERROR__USER_ALREADY_PAUSED = 0x1772; // 6002
export const LEND_LIQUIDITY_ERROR__USER_ALREADY_UNPAUSED = 0x1773; // 6003
export const LEND_LIQUIDITY_ERROR__ONLY_LIQUIDITY_AUTHORITY = 0x1774; // 6004
export const LEND_LIQUIDITY_ERROR__ONLY_AUTH = 0x1775; // 6005
export const LEND_LIQUIDITY_ERROR__ONLY_GUARDIANS = 0x1776; // 6006
export const LEND_LIQUIDITY_ERROR__INVALID_PARAMS = 0x1777; // 6007
export const LEND_LIQUIDITY_ERROR__INVALID_CONFIG_ORDER = 0x1778; // 6008
export const LEND_LIQUIDITY_ERROR__STATUS_ALREADY_SET = 0x1779; // 6009
export const LEND_LIQUIDITY_ERROR__LIMITS_CANNOT_BE_ZERO = 0x177a; // 6010
export const LEND_LIQUIDITY_ERROR__MAX_AUTH_COUNT_REACHED = 0x177b; // 6011
export const LEND_LIQUIDITY_ERROR__MAX_USER_CLASSES_REACHED = 0x177c; // 6012
export const LEND_LIQUIDITY_ERROR__INSUFFICIENT_BALANCE = 0x177d; // 6013
export const LEND_LIQUIDITY_ERROR__USER_SUPPLY_POSITION_REQUIRED = 0x177e; // 6014
export const LEND_LIQUIDITY_ERROR__USER_BORROW_POSITION_REQUIRED = 0x177f; // 6015
export const LEND_LIQUIDITY_ERROR__CLAIM_ACCOUNT_REQUIRED = 0x1780; // 6016
export const LEND_LIQUIDITY_ERROR__WITHDRAW_TO_ACCOUNT_REQUIRED = 0x1781; // 6017
export const LEND_LIQUIDITY_ERROR__BORROW_TO_ACCOUNT_REQUIRED = 0x1782; // 6018
export const LEND_LIQUIDITY_ERROR__INVALID_CLAIM_AMOUNT = 0x1783; // 6019
export const LEND_LIQUIDITY_ERROR__NO_AMOUNT_TO_CLAIM = 0x1784; // 6020
export const LEND_LIQUIDITY_ERROR__AMOUNT_NOT_ZERO = 0x1785; // 6021
export const LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW = 0x1786; // 6022
export const LEND_LIQUIDITY_ERROR__INVALID_TRANSFER_TYPE = 0x1787; // 6023
export const LEND_LIQUIDITY_ERROR__MINT_MISMATCH = 0x1788; // 6024
export const LEND_LIQUIDITY_ERROR__USER_NOT_DEFINED = 0x1789; // 6025
export const LEND_LIQUIDITY_ERROR__INVALID_USER_CLAIM = 0x178a; // 6026
export const LEND_LIQUIDITY_ERROR__USER_PAUSED = 0x178b; // 6027
export const LEND_LIQUIDITY_ERROR__WITHDRAWAL_LIMIT_REACHED = 0x178c; // 6028
export const LEND_LIQUIDITY_ERROR__BORROW_LIMIT_REACHED = 0x178d; // 6029
export const LEND_LIQUIDITY_ERROR__OPERATE_AMOUNTS_NEARLY_ZERO = 0x178e; // 6030
export const LEND_LIQUIDITY_ERROR__OPERATE_AMOUNT_TOO_BIG = 0x178f; // 6031
export const LEND_LIQUIDITY_ERROR__OPERATE_AMOUNTS_INSUFFICIENT = 0x1790; // 6032
export const LEND_LIQUIDITY_ERROR__TRANSFER_AMOUNT_OUT_OF_BOUNDS = 0x1791; // 6033
export const LEND_LIQUIDITY_ERROR__FORBIDDEN_OPERATE_CALL = 0x1792; // 6034
export const LEND_LIQUIDITY_ERROR__MAX_UTILIZATION_REACHED = 0x1793; // 6035
export const LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW_TOTAL_SUPPLY = 0x1794; // 6036
export const LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW_TOTAL_BORROW = 0x1795; // 6037
export const LEND_LIQUIDITY_ERROR__DEPOSIT_EXPECTED = 0x1796; // 6038
export const LEND_LIQUIDITY_ERROR__EXCHANGE_PRICE_ZERO = 0x1797; // 6039
export const LEND_LIQUIDITY_ERROR__UNSUPPORTED_RATE_VERSION = 0x1798; // 6040
export const LEND_LIQUIDITY_ERROR__BORROW_RATE_NEGATIVE = 0x1799; // 6041
export const LEND_LIQUIDITY_ERROR__PROTOCOL_LOCKDOWN = 0x179a; // 6042
export const LEND_LIQUIDITY_ERROR__TOKEN_LOCK_DOWN = 0x179b; // 6043
export const LEND_LIQUIDITY_ERROR__TOKEN_ALREADY_LOCKED = 0x179c; // 6044
export const LEND_LIQUIDITY_ERROR__TOKEN_ALREADY_UNLOCKED = 0x179d; // 6045
export const LEND_LIQUIDITY_ERROR__OPERATE_SKIP_TRANSFER_INVALID = 0x179e; // 6046

export type LendLiquidityError =
    | typeof LEND_LIQUIDITY_ERROR__AMOUNT_NOT_ZERO
    | typeof LEND_LIQUIDITY_ERROR__BORROW_LIMIT_REACHED
    | typeof LEND_LIQUIDITY_ERROR__BORROW_RATE_NEGATIVE
    | typeof LEND_LIQUIDITY_ERROR__BORROW_TO_ACCOUNT_REQUIRED
    | typeof LEND_LIQUIDITY_ERROR__CLAIM_ACCOUNT_REQUIRED
    | typeof LEND_LIQUIDITY_ERROR__DEPOSIT_EXPECTED
    | typeof LEND_LIQUIDITY_ERROR__EXCHANGE_PRICE_ZERO
    | typeof LEND_LIQUIDITY_ERROR__FORBIDDEN_OPERATE_CALL
    | typeof LEND_LIQUIDITY_ERROR__INSUFFICIENT_BALANCE
    | typeof LEND_LIQUIDITY_ERROR__INVALID_CLAIM_AMOUNT
    | typeof LEND_LIQUIDITY_ERROR__INVALID_CONFIG_ORDER
    | typeof LEND_LIQUIDITY_ERROR__INVALID_PARAMS
    | typeof LEND_LIQUIDITY_ERROR__INVALID_TRANSFER_TYPE
    | typeof LEND_LIQUIDITY_ERROR__INVALID_USER_CLAIM
    | typeof LEND_LIQUIDITY_ERROR__LIMITS_CANNOT_BE_ZERO
    | typeof LEND_LIQUIDITY_ERROR__MAX_AUTH_COUNT_REACHED
    | typeof LEND_LIQUIDITY_ERROR__MAX_USER_CLASSES_REACHED
    | typeof LEND_LIQUIDITY_ERROR__MAX_UTILIZATION_REACHED
    | typeof LEND_LIQUIDITY_ERROR__MINT_MISMATCH
    | typeof LEND_LIQUIDITY_ERROR__NO_AMOUNT_TO_CLAIM
    | typeof LEND_LIQUIDITY_ERROR__ONLY_AUTH
    | typeof LEND_LIQUIDITY_ERROR__ONLY_GUARDIANS
    | typeof LEND_LIQUIDITY_ERROR__ONLY_LIQUIDITY_AUTHORITY
    | typeof LEND_LIQUIDITY_ERROR__OPERATE_AMOUNTS_INSUFFICIENT
    | typeof LEND_LIQUIDITY_ERROR__OPERATE_AMOUNTS_NEARLY_ZERO
    | typeof LEND_LIQUIDITY_ERROR__OPERATE_AMOUNT_TOO_BIG
    | typeof LEND_LIQUIDITY_ERROR__OPERATE_SKIP_TRANSFER_INVALID
    | typeof LEND_LIQUIDITY_ERROR__PROTOCOL_LOCKDOWN
    | typeof LEND_LIQUIDITY_ERROR__STATUS_ALREADY_SET
    | typeof LEND_LIQUIDITY_ERROR__TOKEN_ALREADY_LOCKED
    | typeof LEND_LIQUIDITY_ERROR__TOKEN_ALREADY_UNLOCKED
    | typeof LEND_LIQUIDITY_ERROR__TOKEN_LOCK_DOWN
    | typeof LEND_LIQUIDITY_ERROR__TRANSFER_AMOUNT_OUT_OF_BOUNDS
    | typeof LEND_LIQUIDITY_ERROR__UNSUPPORTED_RATE_VERSION
    | typeof LEND_LIQUIDITY_ERROR__USER_ALREADY_PAUSED
    | typeof LEND_LIQUIDITY_ERROR__USER_ALREADY_UNPAUSED
    | typeof LEND_LIQUIDITY_ERROR__USER_BORROW_POSITION_REQUIRED
    | typeof LEND_LIQUIDITY_ERROR__USER_CLASS_NOT_FOUND
    | typeof LEND_LIQUIDITY_ERROR__USER_CLASS_NOT_PAUSABLE
    | typeof LEND_LIQUIDITY_ERROR__USER_NOT_DEFINED
    | typeof LEND_LIQUIDITY_ERROR__USER_PAUSED
    | typeof LEND_LIQUIDITY_ERROR__USER_SUPPLY_POSITION_REQUIRED
    | typeof LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW
    | typeof LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW_TOTAL_BORROW
    | typeof LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW_TOTAL_SUPPLY
    | typeof LEND_LIQUIDITY_ERROR__WITHDRAWAL_LIMIT_REACHED
    | typeof LEND_LIQUIDITY_ERROR__WITHDRAW_TO_ACCOUNT_REQUIRED;

export interface LendLiquidityErrorInfo {
    code: LendLiquidityError;
    name: string;
    message: string;
}

const LENDLIQUIDITY_ERRORS: Readonly<Record<LendLiquidityError, LendLiquidityErrorInfo>> = {
    [LEND_LIQUIDITY_ERROR__USER_CLASS_NOT_PAUSABLE]: {
        code: 6000,
        name: 'userClassNotPausable',
        message: 'ADMIN_MODULE_USER_CLASS_NOT_PAUSABLE',
    },
    [LEND_LIQUIDITY_ERROR__USER_CLASS_NOT_FOUND]: {
        code: 6001,
        name: 'userClassNotFound',
        message: 'ADMIN_MODULE_USER_CLASS_NOT_FOUND',
    },
    [LEND_LIQUIDITY_ERROR__USER_ALREADY_PAUSED]: {
        code: 6002,
        name: 'userAlreadyPaused',
        message: 'ADMIN_MODULE_USER_ALREADY_PAUSED',
    },
    [LEND_LIQUIDITY_ERROR__USER_ALREADY_UNPAUSED]: {
        code: 6003,
        name: 'userAlreadyUnpaused',
        message: 'ADMIN_MODULE_USER_ALREADY_UNPAUSED',
    },
    [LEND_LIQUIDITY_ERROR__ONLY_LIQUIDITY_AUTHORITY]: {
        code: 6004,
        name: 'onlyLiquidityAuthority',
        message: 'ADMIN_MODULE_ONLY_LIQUIDITY_AUTHORITY',
    },
    [LEND_LIQUIDITY_ERROR__ONLY_AUTH]: { code: 6005, name: 'onlyAuth', message: 'ADMIN_MODULE_ONLY_AUTH' },
    [LEND_LIQUIDITY_ERROR__ONLY_GUARDIANS]: {
        code: 6006,
        name: 'onlyGuardians',
        message: 'ADMIN_MODULE_ONLY_GUARDIANS',
    },
    [LEND_LIQUIDITY_ERROR__INVALID_PARAMS]: {
        code: 6007,
        name: 'invalidParams',
        message: 'ADMIN_MODULE_INVALID_PARAMS',
    },
    [LEND_LIQUIDITY_ERROR__INVALID_CONFIG_ORDER]: {
        code: 6008,
        name: 'invalidConfigOrder',
        message: 'ADMIN_MODULE_INVALID_CONFIG_ORDER',
    },
    [LEND_LIQUIDITY_ERROR__STATUS_ALREADY_SET]: {
        code: 6009,
        name: 'statusAlreadySet',
        message: 'ADMIN_MODULE_STATUS_ALREADY_SET',
    },
    [LEND_LIQUIDITY_ERROR__LIMITS_CANNOT_BE_ZERO]: {
        code: 6010,
        name: 'limitsCannotBeZero',
        message: 'ADMIN_MODULE_LIMITS_CAN_NOT_BE_ZERO',
    },
    [LEND_LIQUIDITY_ERROR__MAX_AUTH_COUNT_REACHED]: {
        code: 6011,
        name: 'maxAuthCountReached',
        message: 'ADMIN_MODULE_MAX_AUTH_COUNT',
    },
    [LEND_LIQUIDITY_ERROR__MAX_USER_CLASSES_REACHED]: {
        code: 6012,
        name: 'maxUserClassesReached',
        message: 'ADMIN_MODULE_MAX_USER_CLASSES',
    },
    [LEND_LIQUIDITY_ERROR__INSUFFICIENT_BALANCE]: {
        code: 6013,
        name: 'insufficientBalance',
        message: 'USER_MODULE_INSUFFICIENT_BALANCE',
    },
    [LEND_LIQUIDITY_ERROR__USER_SUPPLY_POSITION_REQUIRED]: {
        code: 6014,
        name: 'userSupplyPositionRequired',
        message: 'USER_MODULE_USER_SUPPLY_POSITION_REQUIRED',
    },
    [LEND_LIQUIDITY_ERROR__USER_BORROW_POSITION_REQUIRED]: {
        code: 6015,
        name: 'userBorrowPositionRequired',
        message: 'USER_MODULE_USER_BORROW_POSITION_REQUIRED',
    },
    [LEND_LIQUIDITY_ERROR__CLAIM_ACCOUNT_REQUIRED]: {
        code: 6016,
        name: 'claimAccountRequired',
        message: 'USER_MODULE_CLAIM_ACCOUNT_REQUIRED',
    },
    [LEND_LIQUIDITY_ERROR__WITHDRAW_TO_ACCOUNT_REQUIRED]: {
        code: 6017,
        name: 'withdrawToAccountRequired',
        message: 'USER_MODULE_WITHDRAW_TO_ACCOUNT_REQUIRED',
    },
    [LEND_LIQUIDITY_ERROR__BORROW_TO_ACCOUNT_REQUIRED]: {
        code: 6018,
        name: 'borrowToAccountRequired',
        message: 'USER_MODULE_BORROW_TO_ACCOUNT_REQUIRED',
    },
    [LEND_LIQUIDITY_ERROR__INVALID_CLAIM_AMOUNT]: {
        code: 6019,
        name: 'invalidClaimAmount',
        message: 'USER_MODULE_INVALID_CLAIM_AMOUNT',
    },
    [LEND_LIQUIDITY_ERROR__NO_AMOUNT_TO_CLAIM]: {
        code: 6020,
        name: 'noAmountToClaim',
        message: 'USER_MODULE_NO_AMOUNT_TO_CLAIM',
    },
    [LEND_LIQUIDITY_ERROR__AMOUNT_NOT_ZERO]: {
        code: 6021,
        name: 'amountNotZero',
        message: 'USER_MODULE_AMOUNT_NOT_ZERO',
    },
    [LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW]: {
        code: 6022,
        name: 'valueOverflow',
        message: 'USER_MODULE_VALUE_OVERFLOW',
    },
    [LEND_LIQUIDITY_ERROR__INVALID_TRANSFER_TYPE]: {
        code: 6023,
        name: 'invalidTransferType',
        message: 'USER_MODULE_INVALID_TRANSFER_TYPE',
    },
    [LEND_LIQUIDITY_ERROR__MINT_MISMATCH]: { code: 6024, name: 'mintMismatch', message: 'USER_MODULE_MINT_MISMATCH' },
    [LEND_LIQUIDITY_ERROR__USER_NOT_DEFINED]: {
        code: 6025,
        name: 'userNotDefined',
        message: 'USER_MODULE_USER_NOT_DEFINED',
    },
    [LEND_LIQUIDITY_ERROR__INVALID_USER_CLAIM]: {
        code: 6026,
        name: 'invalidUserClaim',
        message: 'USER_MODULE_INVALID_USER_CLAIM',
    },
    [LEND_LIQUIDITY_ERROR__USER_PAUSED]: { code: 6027, name: 'userPaused', message: 'USER_MODULE_USER_PAUSED' },
    [LEND_LIQUIDITY_ERROR__WITHDRAWAL_LIMIT_REACHED]: {
        code: 6028,
        name: 'withdrawalLimitReached',
        message: 'USER_MODULE_WITHDRAWAL_LIMIT_REACHED',
    },
    [LEND_LIQUIDITY_ERROR__BORROW_LIMIT_REACHED]: {
        code: 6029,
        name: 'borrowLimitReached',
        message: 'USER_MODULE_BORROW_LIMIT_REACHED',
    },
    [LEND_LIQUIDITY_ERROR__OPERATE_AMOUNTS_NEARLY_ZERO]: {
        code: 6030,
        name: 'operateAmountsNearlyZero',
        message: 'USER_MODULE_OPERATE_AMOUNTS_ZERO',
    },
    [LEND_LIQUIDITY_ERROR__OPERATE_AMOUNT_TOO_BIG]: {
        code: 6031,
        name: 'operateAmountTooBig',
        message: 'USER_MODULE_OPERATE_AMOUNTS_TOO_BIG',
    },
    [LEND_LIQUIDITY_ERROR__OPERATE_AMOUNTS_INSUFFICIENT]: {
        code: 6032,
        name: 'operateAmountsInsufficient',
        message: 'USER_MODULE_OPERATE_AMOUNTS_INSUFFICIENT',
    },
    [LEND_LIQUIDITY_ERROR__TRANSFER_AMOUNT_OUT_OF_BOUNDS]: {
        code: 6033,
        name: 'transferAmountOutOfBounds',
        message: 'USER_MODULE_TRANSFER_AMOUNT_OUT_OF_BOUNDS',
    },
    [LEND_LIQUIDITY_ERROR__FORBIDDEN_OPERATE_CALL]: {
        code: 6034,
        name: 'forbiddenOperateCall',
        message: 'FORBIDDEN_OPERATE_CALL',
    },
    [LEND_LIQUIDITY_ERROR__MAX_UTILIZATION_REACHED]: {
        code: 6035,
        name: 'maxUtilizationReached',
        message: 'USER_MODULE_MAX_UTILIZATION_REACHED',
    },
    [LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW_TOTAL_SUPPLY]: {
        code: 6036,
        name: 'valueOverflowTotalSupply',
        message: 'USER_MODULE_VALUE_OVERFLOW_TOTAL_SUPPLY',
    },
    [LEND_LIQUIDITY_ERROR__VALUE_OVERFLOW_TOTAL_BORROW]: {
        code: 6037,
        name: 'valueOverflowTotalBorrow',
        message: 'USER_MODULE_VALUE_OVERFLOW_TOTAL_BORROW',
    },
    [LEND_LIQUIDITY_ERROR__DEPOSIT_EXPECTED]: {
        code: 6038,
        name: 'depositExpected',
        message: 'USER_MODULE_DEPOSIT_EXPECTED',
    },
    [LEND_LIQUIDITY_ERROR__EXCHANGE_PRICE_ZERO]: {
        code: 6039,
        name: 'exchangePriceZero',
        message: 'LIQUIDITY_CALCS_EXCHANGE_PRICE_ZERO',
    },
    [LEND_LIQUIDITY_ERROR__UNSUPPORTED_RATE_VERSION]: {
        code: 6040,
        name: 'unsupportedRateVersion',
        message: 'LIQUIDITY_CALCS_UNSUPPORTED_RATE_VERSION',
    },
    [LEND_LIQUIDITY_ERROR__BORROW_RATE_NEGATIVE]: {
        code: 6041,
        name: 'borrowRateNegative',
        message: 'LIQUIDITY_CALCS_BORROW_RATE_NEGATIVE',
    },
    [LEND_LIQUIDITY_ERROR__PROTOCOL_LOCKDOWN]: { code: 6042, name: 'protocolLockdown', message: 'PROTOCOL_LOCKDOWN' },
    [LEND_LIQUIDITY_ERROR__TOKEN_LOCK_DOWN]: { code: 6043, name: 'tokenLockDown', message: 'TOKEN_LOCKED_DOWN' },
    [LEND_LIQUIDITY_ERROR__TOKEN_ALREADY_LOCKED]: {
        code: 6044,
        name: 'tokenAlreadyLocked',
        message: 'TOKEN_ALREADY_LOCKED',
    },
    [LEND_LIQUIDITY_ERROR__TOKEN_ALREADY_UNLOCKED]: {
        code: 6045,
        name: 'tokenAlreadyUnlocked',
        message: 'TOKEN_ALREADY_UNLOCKED',
    },
    [LEND_LIQUIDITY_ERROR__OPERATE_SKIP_TRANSFER_INVALID]: {
        code: 6046,
        name: 'operateSkipTransferInvalid',
        message: 'USER_MODULE_OPERATE_SKIP_TRANSFER_INVALID',
    },
};

export function getLendLiquidityErrorFromCode(code: number): LendLiquidityErrorInfo | undefined {
    return LENDLIQUIDITY_ERRORS[code as LendLiquidityError];
}

export function getLendLiquidityErrorMessage(code: LendLiquidityError): string {
    return LENDLIQUIDITY_ERRORS[code].message;
}
