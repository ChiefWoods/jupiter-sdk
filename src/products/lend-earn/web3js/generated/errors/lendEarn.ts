export const LEND_EARN_ERROR__F_TOKEN_DEPOSIT_INSIGNIFICANT = 0x1770; // 6000
export const LEND_EARN_ERROR__F_TOKEN_MIN_AMOUNT_OUT = 0x1771; // 6001
export const LEND_EARN_ERROR__F_TOKEN_MAX_AMOUNT = 0x1772; // 6002
export const LEND_EARN_ERROR__F_TOKEN_INVALID_PARAMS = 0x1773; // 6003
export const LEND_EARN_ERROR__F_TOKEN_REWARDS_RATE_MODEL_ALREADY_SET = 0x1774; // 6004
export const LEND_EARN_ERROR__F_TOKEN_MAX_AUTH_COUNT_REACHED = 0x1775; // 6005
export const LEND_EARN_ERROR__F_TOKEN_LIQUIDITY_EXCHANGE_PRICE_UNEXPECTED = 0x1776; // 6006
export const LEND_EARN_ERROR__F_TOKEN_CPI_TO_LIQUIDITY_FAILED = 0x1777; // 6007
export const LEND_EARN_ERROR__F_TOKEN_ONLY_AUTH = 0x1778; // 6008
export const LEND_EARN_ERROR__F_TOKEN_ONLY_AUTHORITY = 0x1779; // 6009
export const LEND_EARN_ERROR__F_TOKEN_ONLY_REBALANCER = 0x177a; // 6010
export const LEND_EARN_ERROR__F_TOKEN_USER_SUPPLY_POSITION_REQUIRED = 0x177b; // 6011
export const LEND_EARN_ERROR__F_TOKEN_LIQUIDITY_PROGRAM_MISMATCH = 0x177c; // 6012

export type LendEarnError =
    | typeof LEND_EARN_ERROR__F_TOKEN_CPI_TO_LIQUIDITY_FAILED
    | typeof LEND_EARN_ERROR__F_TOKEN_DEPOSIT_INSIGNIFICANT
    | typeof LEND_EARN_ERROR__F_TOKEN_INVALID_PARAMS
    | typeof LEND_EARN_ERROR__F_TOKEN_LIQUIDITY_EXCHANGE_PRICE_UNEXPECTED
    | typeof LEND_EARN_ERROR__F_TOKEN_LIQUIDITY_PROGRAM_MISMATCH
    | typeof LEND_EARN_ERROR__F_TOKEN_MAX_AMOUNT
    | typeof LEND_EARN_ERROR__F_TOKEN_MAX_AUTH_COUNT_REACHED
    | typeof LEND_EARN_ERROR__F_TOKEN_MIN_AMOUNT_OUT
    | typeof LEND_EARN_ERROR__F_TOKEN_ONLY_AUTH
    | typeof LEND_EARN_ERROR__F_TOKEN_ONLY_AUTHORITY
    | typeof LEND_EARN_ERROR__F_TOKEN_ONLY_REBALANCER
    | typeof LEND_EARN_ERROR__F_TOKEN_REWARDS_RATE_MODEL_ALREADY_SET
    | typeof LEND_EARN_ERROR__F_TOKEN_USER_SUPPLY_POSITION_REQUIRED;

export interface LendEarnErrorInfo {
    code: LendEarnError;
    name: string;
    message: string;
}

const LENDEARN_ERRORS: Readonly<Record<LendEarnError, LendEarnErrorInfo>> = {
    [LEND_EARN_ERROR__F_TOKEN_DEPOSIT_INSIGNIFICANT]: {
        code: 6000,
        name: 'fTokenDepositInsignificant',
        message: 'F_TOKEN_DEPOSIT_INSIGNIFICANT',
    },
    [LEND_EARN_ERROR__F_TOKEN_MIN_AMOUNT_OUT]: {
        code: 6001,
        name: 'fTokenMinAmountOut',
        message: 'F_TOKEN_MIN_AMOUNT_OUT',
    },
    [LEND_EARN_ERROR__F_TOKEN_MAX_AMOUNT]: { code: 6002, name: 'fTokenMaxAmount', message: 'F_TOKEN_MAX_AMOUNT' },
    [LEND_EARN_ERROR__F_TOKEN_INVALID_PARAMS]: {
        code: 6003,
        name: 'fTokenInvalidParams',
        message: 'F_TOKEN_INVALID_PARAMS',
    },
    [LEND_EARN_ERROR__F_TOKEN_REWARDS_RATE_MODEL_ALREADY_SET]: {
        code: 6004,
        name: 'fTokenRewardsRateModelAlreadySet',
        message: 'F_TOKEN_REWARDS_RATE_MODEL_ALREADY_SET',
    },
    [LEND_EARN_ERROR__F_TOKEN_MAX_AUTH_COUNT_REACHED]: {
        code: 6005,
        name: 'fTokenMaxAuthCountReached',
        message: 'F_TOKEN_MAX_AUTH_COUNT',
    },
    [LEND_EARN_ERROR__F_TOKEN_LIQUIDITY_EXCHANGE_PRICE_UNEXPECTED]: {
        code: 6006,
        name: 'fTokenLiquidityExchangePriceUnexpected',
        message: 'F_TOKEN_LIQUIDITY_EXCHANGE_PRICE_UNEXPECTED',
    },
    [LEND_EARN_ERROR__F_TOKEN_CPI_TO_LIQUIDITY_FAILED]: {
        code: 6007,
        name: 'fTokenCpiToLiquidityFailed',
        message: 'F_TOKEN_CPI_TO_LIQUIDITY_FAILED',
    },
    [LEND_EARN_ERROR__F_TOKEN_ONLY_AUTH]: { code: 6008, name: 'fTokenOnlyAuth', message: 'F_TOKEN_ONLY_AUTH' },
    [LEND_EARN_ERROR__F_TOKEN_ONLY_AUTHORITY]: {
        code: 6009,
        name: 'fTokenOnlyAuthority',
        message: 'F_TOKEN_ONLY_AUTHORITY',
    },
    [LEND_EARN_ERROR__F_TOKEN_ONLY_REBALANCER]: {
        code: 6010,
        name: 'fTokenOnlyRebalancer',
        message: 'F_TOKEN_ONLY_REBALANCER',
    },
    [LEND_EARN_ERROR__F_TOKEN_USER_SUPPLY_POSITION_REQUIRED]: {
        code: 6011,
        name: 'fTokenUserSupplyPositionRequired',
        message: 'F_TOKEN_USER_SUPPLY_POSITION_REQUIRED',
    },
    [LEND_EARN_ERROR__F_TOKEN_LIQUIDITY_PROGRAM_MISMATCH]: {
        code: 6012,
        name: 'fTokenLiquidityProgramMismatch',
        message: 'F_TOKEN_LIQUIDITY_PROGRAM_MISMATCH',
    },
};

export function getLendEarnErrorFromCode(code: number): LendEarnErrorInfo | undefined {
    return LENDEARN_ERRORS[code as LendEarnError];
}

export function getLendEarnErrorMessage(code: LendEarnError): string {
    return LENDEARN_ERRORS[code].message;
}
