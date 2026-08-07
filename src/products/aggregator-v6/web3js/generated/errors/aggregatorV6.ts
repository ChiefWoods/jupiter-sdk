export const AGGREGATOR_V6_ERROR__EMPTY_ROUTE = 0x1770; // 6000
export const AGGREGATOR_V6_ERROR__SLIPPAGE_TOLERANCE_EXCEEDED = 0x1771; // 6001
export const AGGREGATOR_V6_ERROR__INVALID_CALCULATION = 0x1772; // 6002
export const AGGREGATOR_V6_ERROR__MISSING_PLATFORM_FEE_ACCOUNT = 0x1773; // 6003
export const AGGREGATOR_V6_ERROR__INVALID_SLIPPAGE = 0x1774; // 6004
export const AGGREGATOR_V6_ERROR__NOT_ENOUGH_PERCENT = 0x1775; // 6005
export const AGGREGATOR_V6_ERROR__INVALID_INPUT_INDEX = 0x1776; // 6006
export const AGGREGATOR_V6_ERROR__INVALID_OUTPUT_INDEX = 0x1777; // 6007
export const AGGREGATOR_V6_ERROR__NOT_ENOUGH_ACCOUNT_KEYS = 0x1778; // 6008
export const AGGREGATOR_V6_ERROR__NON_ZERO_MINIMUM_OUT_AMOUNT_NOT_SUPPORTED = 0x1779; // 6009
export const AGGREGATOR_V6_ERROR__INVALID_ROUTE_PLAN = 0x177a; // 6010
export const AGGREGATOR_V6_ERROR__INVALID_REFERRAL_AUTHORITY = 0x177b; // 6011
export const AGGREGATOR_V6_ERROR__LEDGER_TOKEN_ACCOUNT_DOES_NOT_MATCH = 0x177c; // 6012
export const AGGREGATOR_V6_ERROR__INVALID_TOKEN_LEDGER = 0x177d; // 6013
export const AGGREGATOR_V6_ERROR__INCORRECT_TOKEN_PROGRAM_I_D = 0x177e; // 6014
export const AGGREGATOR_V6_ERROR__TOKEN_PROGRAM_NOT_PROVIDED = 0x177f; // 6015
export const AGGREGATOR_V6_ERROR__SWAP_NOT_SUPPORTED = 0x1780; // 6016
export const AGGREGATOR_V6_ERROR__EXACT_OUT_AMOUNT_NOT_MATCHED = 0x1781; // 6017
export const AGGREGATOR_V6_ERROR__SOURCE_AND_DESTINATION_MINT_CANNOT_BE_THE_SAME = 0x1782; // 6018
export const AGGREGATOR_V6_ERROR__INVALID_MINT = 0x1783; // 6019
export const AGGREGATOR_V6_ERROR__INVALID_PROGRAM_AUTHORITY = 0x1784; // 6020
export const AGGREGATOR_V6_ERROR__INVALID_OUTPUT_TOKEN_ACCOUNT = 0x1785; // 6021
export const AGGREGATOR_V6_ERROR__INVALID_FEE_WALLET = 0x1786; // 6022
export const AGGREGATOR_V6_ERROR__INVALID_AUTHORITY = 0x1787; // 6023
export const AGGREGATOR_V6_ERROR__INSUFFICIENT_FUNDS = 0x1788; // 6024
export const AGGREGATOR_V6_ERROR__INVALID_TOKEN_ACCOUNT = 0x1789; // 6025
export const AGGREGATOR_V6_ERROR__BONDING_CURVE_ALREADY_COMPLETED = 0x178a; // 6026

export type AggregatorV6Error =
    | typeof AGGREGATOR_V6_ERROR__BONDING_CURVE_ALREADY_COMPLETED
    | typeof AGGREGATOR_V6_ERROR__EMPTY_ROUTE
    | typeof AGGREGATOR_V6_ERROR__EXACT_OUT_AMOUNT_NOT_MATCHED
    | typeof AGGREGATOR_V6_ERROR__INCORRECT_TOKEN_PROGRAM_I_D
    | typeof AGGREGATOR_V6_ERROR__INSUFFICIENT_FUNDS
    | typeof AGGREGATOR_V6_ERROR__INVALID_AUTHORITY
    | typeof AGGREGATOR_V6_ERROR__INVALID_CALCULATION
    | typeof AGGREGATOR_V6_ERROR__INVALID_FEE_WALLET
    | typeof AGGREGATOR_V6_ERROR__INVALID_INPUT_INDEX
    | typeof AGGREGATOR_V6_ERROR__INVALID_MINT
    | typeof AGGREGATOR_V6_ERROR__INVALID_OUTPUT_INDEX
    | typeof AGGREGATOR_V6_ERROR__INVALID_OUTPUT_TOKEN_ACCOUNT
    | typeof AGGREGATOR_V6_ERROR__INVALID_PROGRAM_AUTHORITY
    | typeof AGGREGATOR_V6_ERROR__INVALID_REFERRAL_AUTHORITY
    | typeof AGGREGATOR_V6_ERROR__INVALID_ROUTE_PLAN
    | typeof AGGREGATOR_V6_ERROR__INVALID_SLIPPAGE
    | typeof AGGREGATOR_V6_ERROR__INVALID_TOKEN_ACCOUNT
    | typeof AGGREGATOR_V6_ERROR__INVALID_TOKEN_LEDGER
    | typeof AGGREGATOR_V6_ERROR__LEDGER_TOKEN_ACCOUNT_DOES_NOT_MATCH
    | typeof AGGREGATOR_V6_ERROR__MISSING_PLATFORM_FEE_ACCOUNT
    | typeof AGGREGATOR_V6_ERROR__NON_ZERO_MINIMUM_OUT_AMOUNT_NOT_SUPPORTED
    | typeof AGGREGATOR_V6_ERROR__NOT_ENOUGH_ACCOUNT_KEYS
    | typeof AGGREGATOR_V6_ERROR__NOT_ENOUGH_PERCENT
    | typeof AGGREGATOR_V6_ERROR__SLIPPAGE_TOLERANCE_EXCEEDED
    | typeof AGGREGATOR_V6_ERROR__SOURCE_AND_DESTINATION_MINT_CANNOT_BE_THE_SAME
    | typeof AGGREGATOR_V6_ERROR__SWAP_NOT_SUPPORTED
    | typeof AGGREGATOR_V6_ERROR__TOKEN_PROGRAM_NOT_PROVIDED;

export interface AggregatorV6ErrorInfo {
    code: AggregatorV6Error;
    name: string;
    message: string;
}

const AGGREGATORV6_ERRORS: Readonly<Record<AggregatorV6Error, AggregatorV6ErrorInfo>> = {
    [AGGREGATOR_V6_ERROR__EMPTY_ROUTE]: { code: 6000, name: 'emptyRoute', message: 'Empty route' },
    [AGGREGATOR_V6_ERROR__SLIPPAGE_TOLERANCE_EXCEEDED]: {
        code: 6001,
        name: 'slippageToleranceExceeded',
        message: 'Slippage tolerance exceeded',
    },
    [AGGREGATOR_V6_ERROR__INVALID_CALCULATION]: {
        code: 6002,
        name: 'invalidCalculation',
        message: 'Invalid calculation',
    },
    [AGGREGATOR_V6_ERROR__MISSING_PLATFORM_FEE_ACCOUNT]: {
        code: 6003,
        name: 'missingPlatformFeeAccount',
        message: 'Missing platform fee account',
    },
    [AGGREGATOR_V6_ERROR__INVALID_SLIPPAGE]: { code: 6004, name: 'invalidSlippage', message: 'Invalid slippage' },
    [AGGREGATOR_V6_ERROR__NOT_ENOUGH_PERCENT]: {
        code: 6005,
        name: 'notEnoughPercent',
        message: 'Not enough percent to 100',
    },
    [AGGREGATOR_V6_ERROR__INVALID_INPUT_INDEX]: {
        code: 6006,
        name: 'invalidInputIndex',
        message: 'Token input index is invalid',
    },
    [AGGREGATOR_V6_ERROR__INVALID_OUTPUT_INDEX]: {
        code: 6007,
        name: 'invalidOutputIndex',
        message: 'Token output index is invalid',
    },
    [AGGREGATOR_V6_ERROR__NOT_ENOUGH_ACCOUNT_KEYS]: {
        code: 6008,
        name: 'notEnoughAccountKeys',
        message: 'Not Enough Account keys',
    },
    [AGGREGATOR_V6_ERROR__NON_ZERO_MINIMUM_OUT_AMOUNT_NOT_SUPPORTED]: {
        code: 6009,
        name: 'nonZeroMinimumOutAmountNotSupported',
        message: 'Non zero minimum out amount not supported',
    },
    [AGGREGATOR_V6_ERROR__INVALID_ROUTE_PLAN]: { code: 6010, name: 'invalidRoutePlan', message: 'Invalid route plan' },
    [AGGREGATOR_V6_ERROR__INVALID_REFERRAL_AUTHORITY]: {
        code: 6011,
        name: 'invalidReferralAuthority',
        message: 'Invalid referral authority',
    },
    [AGGREGATOR_V6_ERROR__LEDGER_TOKEN_ACCOUNT_DOES_NOT_MATCH]: {
        code: 6012,
        name: 'ledgerTokenAccountDoesNotMatch',
        message: "Token account doesn't match the ledger",
    },
    [AGGREGATOR_V6_ERROR__INVALID_TOKEN_LEDGER]: {
        code: 6013,
        name: 'invalidTokenLedger',
        message: 'Invalid token ledger',
    },
    [AGGREGATOR_V6_ERROR__INCORRECT_TOKEN_PROGRAM_I_D]: {
        code: 6014,
        name: 'incorrectTokenProgramID',
        message: 'Token program ID is invalid',
    },
    [AGGREGATOR_V6_ERROR__TOKEN_PROGRAM_NOT_PROVIDED]: {
        code: 6015,
        name: 'tokenProgramNotProvided',
        message: 'Token program not provided',
    },
    [AGGREGATOR_V6_ERROR__SWAP_NOT_SUPPORTED]: { code: 6016, name: 'swapNotSupported', message: 'Swap not supported' },
    [AGGREGATOR_V6_ERROR__EXACT_OUT_AMOUNT_NOT_MATCHED]: {
        code: 6017,
        name: 'exactOutAmountNotMatched',
        message: "Exact out amount doesn't match",
    },
    [AGGREGATOR_V6_ERROR__SOURCE_AND_DESTINATION_MINT_CANNOT_BE_THE_SAME]: {
        code: 6018,
        name: 'sourceAndDestinationMintCannotBeTheSame',
        message: 'Source mint and destination mint cannot the same',
    },
    [AGGREGATOR_V6_ERROR__INVALID_MINT]: { code: 6019, name: 'invalidMint', message: 'Invalid mint' },
    [AGGREGATOR_V6_ERROR__INVALID_PROGRAM_AUTHORITY]: {
        code: 6020,
        name: 'invalidProgramAuthority',
        message: 'Invalid program authority',
    },
    [AGGREGATOR_V6_ERROR__INVALID_OUTPUT_TOKEN_ACCOUNT]: {
        code: 6021,
        name: 'invalidOutputTokenAccount',
        message: 'Invalid output token account',
    },
    [AGGREGATOR_V6_ERROR__INVALID_FEE_WALLET]: { code: 6022, name: 'invalidFeeWallet', message: 'Invalid fee wallet' },
    [AGGREGATOR_V6_ERROR__INVALID_AUTHORITY]: { code: 6023, name: 'invalidAuthority', message: 'Invalid authority' },
    [AGGREGATOR_V6_ERROR__INSUFFICIENT_FUNDS]: { code: 6024, name: 'insufficientFunds', message: 'Insufficient funds' },
    [AGGREGATOR_V6_ERROR__INVALID_TOKEN_ACCOUNT]: {
        code: 6025,
        name: 'invalidTokenAccount',
        message: 'Invalid token account',
    },
    [AGGREGATOR_V6_ERROR__BONDING_CURVE_ALREADY_COMPLETED]: {
        code: 6026,
        name: 'bondingCurveAlreadyCompleted',
        message: 'Bonding curve already completed',
    },
};

export function getAggregatorV6ErrorFromCode(code: number): AggregatorV6ErrorInfo | undefined {
    return AGGREGATORV6_ERRORS[code as AggregatorV6Error];
}

export function getAggregatorV6ErrorMessage(code: AggregatorV6Error): string {
    return AGGREGATORV6_ERRORS[code].message;
}
