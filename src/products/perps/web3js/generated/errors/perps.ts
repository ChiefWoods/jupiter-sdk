export const PERPS_ERROR__MATH_OVERFLOW = 0x1770; // 6000
export const PERPS_ERROR__UNSUPPORTED_ORACLE = 0x1771; // 6001
export const PERPS_ERROR__INVALID_ORACLE_ACCOUNT = 0x1772; // 6002
export const PERPS_ERROR__STALE_ORACLE_PRICE = 0x1773; // 6003
export const PERPS_ERROR__INVALID_ORACLE_PRICE = 0x1774; // 6004
export const PERPS_ERROR__INVALID_ENVIRONMENT = 0x1775; // 6005
export const PERPS_ERROR__INVALID_COLLATERAL_ACCOUNT = 0x1776; // 6006
export const PERPS_ERROR__INVALID_COLLATERAL_AMOUNT = 0x1777; // 6007
export const PERPS_ERROR__COLLATERAL_SLIPPAGE = 0x1778; // 6008
export const PERPS_ERROR__INVALID_POSITION_STATE = 0x1779; // 6009
export const PERPS_ERROR__INVALID_PERPETUALS_CONFIG = 0x177a; // 6010
export const PERPS_ERROR__INVALID_POOL_CONFIG = 0x177b; // 6011
export const PERPS_ERROR__INVALID_INSTRUCTION = 0x177c; // 6012
export const PERPS_ERROR__INVALID_CUSTODY_CONFIG = 0x177d; // 6013
export const PERPS_ERROR__INVALID_CUSTODY_BALANCE = 0x177e; // 6014
export const PERPS_ERROR__INVALID_ARGUMENT = 0x177f; // 6015
export const PERPS_ERROR__INVALID_POSITION_REQUEST = 0x1780; // 6016
export const PERPS_ERROR__INVALID_POSITION_REQUEST_INPUT_ATA = 0x1781; // 6017
export const PERPS_ERROR__INVALID_MINT = 0x1782; // 6018
export const PERPS_ERROR__INSUFFICIENT_TOKEN_AMOUNT = 0x1783; // 6019
export const PERPS_ERROR__INSUFFICIENT_AMOUNT_RETURNED = 0x1784; // 6020
export const PERPS_ERROR__MAX_PRICE_SLIPPAGE = 0x1785; // 6021
export const PERPS_ERROR__MAX_LEVERAGE = 0x1786; // 6022
export const PERPS_ERROR__CUSTODY_AMOUNT_LIMIT = 0x1787; // 6023
export const PERPS_ERROR__POOL_AMOUNT_LIMIT = 0x1788; // 6024
export const PERPS_ERROR__PERSONAL_POOL_AMOUNT_LIMIT = 0x1789; // 6025
export const PERPS_ERROR__UNSUPPORTED_TOKEN = 0x178a; // 6026
export const PERPS_ERROR__INSTRUCTION_NOT_ALLOWED = 0x178b; // 6027
export const PERPS_ERROR__JUPITER_PROGRAM_MISMATCH = 0x178c; // 6028
export const PERPS_ERROR__PROGRAM_MISMATCH = 0x178d; // 6029
export const PERPS_ERROR__ADDRESS_MISMATCH = 0x178e; // 6030
export const PERPS_ERROR__KEEPER_A_T_A_MISSING = 0x178f; // 6031
export const PERPS_ERROR__SWAP_AMOUNT_MISMATCH = 0x1790; // 6032
export const PERPS_ERROR__C_P_I_NOT_ALLOWED = 0x1791; // 6033
export const PERPS_ERROR__INVALID_KEEPER = 0x1792; // 6034
export const PERPS_ERROR__EXCEED_EXECUTION_PERIOD = 0x1793; // 6035
export const PERPS_ERROR__INVALID_REQUEST_TYPE = 0x1794; // 6036
export const PERPS_ERROR__INVALID_TRIGGER_PRICE = 0x1795; // 6037
export const PERPS_ERROR__TRIGGER_PRICE_SLIPPAGE = 0x1796; // 6038
export const PERPS_ERROR__MISSING_TRIGGER_PRICE = 0x1797; // 6039
export const PERPS_ERROR__MISSING_PRICE_SLIPPAGE = 0x1798; // 6040
export const PERPS_ERROR__INVALID_PRICE_CALC_MODE = 0x1799; // 6041
export const PERPS_ERROR__REQUEST_UPDATED_TOO_RECENT = 0x179a; // 6042
export const PERPS_ERROR__EXCEED_TOKEN_WEIGHTAGE = 0x179b; // 6043
export const PERPS_ERROR__ORACLE_PUBLISH_TIME_TOO_EARLY = 0x179c; // 6044
export const PERPS_ERROR__PULL_ORACLE_PUBLISH_TIME_TOO_EARLY = 0x179d; // 6045
export const PERPS_ERROR__STALE_PULL_ORACLE_PRICE = 0x179e; // 6046
export const PERPS_ERROR__INVALID_PULL_ORACLE_PRICE = 0x179f; // 6047
export const PERPS_ERROR__PULL_ORACLE_NOT_VERIFIED = 0x17a0; // 6048
export const PERPS_ERROR__PRICE_DIFF_TOO_LARGE = 0x17a1; // 6049
export const PERPS_ERROR__INVALID_DOVES_ORACLE_PRICE = 0x17a2; // 6050
export const PERPS_ERROR__INVALID_REQUEST_TIME = 0x17a3; // 6051
export const PERPS_ERROR__POSITION_UPDATED_TOO_RECENT = 0x17a4; // 6052
export const PERPS_ERROR__LEDGER_TOKEN_ACCOUNT_DOES_NOT_MATCH = 0x17a5; // 6053
export const PERPS_ERROR__INVALID_TOKEN_LEDGER = 0x17a6; // 6054
export const PERPS_ERROR__ORACLE_PRICE_DIFFERENCE_TOO_LARGE = 0x17a7; // 6055
export const PERPS_ERROR__INVALID_ORACLE_SIGNER = 0x17a8; // 6056
export const PERPS_ERROR__INVALID_ORACLE_TIMESTAMP = 0x17a9; // 6057
export const PERPS_ERROR__INVALID_MAX_GLOBAL_LONG_SIZE = 0x17aa; // 6058
export const PERPS_ERROR__INVALID_MAX_GLOBAL_SHORT_SIZE = 0x17ab; // 6059
export const PERPS_ERROR__BORROWS_DISABLED = 0x17ac; // 6060
export const PERPS_ERROR__BORROW_LIMITS_EXCEEDED = 0x17ad; // 6061
export const PERPS_ERROR__WITHDRAW_EXCEEDS_MARGIN_LIMITS = 0x17ae; // 6062
export const PERPS_ERROR__CANNOT_LIQUIDATE = 0x17af; // 6063
export const PERPS_ERROR__CANNOT_DELEGATE_STAKE = 0x17b0; // 6064
export const PERPS_ERROR__EXCEEDED_MAX_TOTAL_STAKED_AMOUNT = 0x17b1; // 6065
export const PERPS_ERROR__LP_TOKEN_PRICE_CHANGE_LIMIT_EXCEEDED = 0x17b2; // 6066

export type PerpsError =
    | typeof PERPS_ERROR__ADDRESS_MISMATCH
    | typeof PERPS_ERROR__BORROW_LIMITS_EXCEEDED
    | typeof PERPS_ERROR__BORROWS_DISABLED
    | typeof PERPS_ERROR__CANNOT_DELEGATE_STAKE
    | typeof PERPS_ERROR__CANNOT_LIQUIDATE
    | typeof PERPS_ERROR__COLLATERAL_SLIPPAGE
    | typeof PERPS_ERROR__C_P_I_NOT_ALLOWED
    | typeof PERPS_ERROR__CUSTODY_AMOUNT_LIMIT
    | typeof PERPS_ERROR__EXCEEDED_MAX_TOTAL_STAKED_AMOUNT
    | typeof PERPS_ERROR__EXCEED_EXECUTION_PERIOD
    | typeof PERPS_ERROR__EXCEED_TOKEN_WEIGHTAGE
    | typeof PERPS_ERROR__INSTRUCTION_NOT_ALLOWED
    | typeof PERPS_ERROR__INSUFFICIENT_AMOUNT_RETURNED
    | typeof PERPS_ERROR__INSUFFICIENT_TOKEN_AMOUNT
    | typeof PERPS_ERROR__INVALID_ARGUMENT
    | typeof PERPS_ERROR__INVALID_COLLATERAL_ACCOUNT
    | typeof PERPS_ERROR__INVALID_COLLATERAL_AMOUNT
    | typeof PERPS_ERROR__INVALID_CUSTODY_BALANCE
    | typeof PERPS_ERROR__INVALID_CUSTODY_CONFIG
    | typeof PERPS_ERROR__INVALID_DOVES_ORACLE_PRICE
    | typeof PERPS_ERROR__INVALID_ENVIRONMENT
    | typeof PERPS_ERROR__INVALID_INSTRUCTION
    | typeof PERPS_ERROR__INVALID_KEEPER
    | typeof PERPS_ERROR__INVALID_MAX_GLOBAL_LONG_SIZE
    | typeof PERPS_ERROR__INVALID_MAX_GLOBAL_SHORT_SIZE
    | typeof PERPS_ERROR__INVALID_MINT
    | typeof PERPS_ERROR__INVALID_ORACLE_ACCOUNT
    | typeof PERPS_ERROR__INVALID_ORACLE_PRICE
    | typeof PERPS_ERROR__INVALID_ORACLE_SIGNER
    | typeof PERPS_ERROR__INVALID_ORACLE_TIMESTAMP
    | typeof PERPS_ERROR__INVALID_PERPETUALS_CONFIG
    | typeof PERPS_ERROR__INVALID_POOL_CONFIG
    | typeof PERPS_ERROR__INVALID_POSITION_REQUEST
    | typeof PERPS_ERROR__INVALID_POSITION_REQUEST_INPUT_ATA
    | typeof PERPS_ERROR__INVALID_POSITION_STATE
    | typeof PERPS_ERROR__INVALID_PRICE_CALC_MODE
    | typeof PERPS_ERROR__INVALID_PULL_ORACLE_PRICE
    | typeof PERPS_ERROR__INVALID_REQUEST_TIME
    | typeof PERPS_ERROR__INVALID_REQUEST_TYPE
    | typeof PERPS_ERROR__INVALID_TOKEN_LEDGER
    | typeof PERPS_ERROR__INVALID_TRIGGER_PRICE
    | typeof PERPS_ERROR__JUPITER_PROGRAM_MISMATCH
    | typeof PERPS_ERROR__KEEPER_A_T_A_MISSING
    | typeof PERPS_ERROR__LEDGER_TOKEN_ACCOUNT_DOES_NOT_MATCH
    | typeof PERPS_ERROR__LP_TOKEN_PRICE_CHANGE_LIMIT_EXCEEDED
    | typeof PERPS_ERROR__MATH_OVERFLOW
    | typeof PERPS_ERROR__MAX_LEVERAGE
    | typeof PERPS_ERROR__MAX_PRICE_SLIPPAGE
    | typeof PERPS_ERROR__MISSING_PRICE_SLIPPAGE
    | typeof PERPS_ERROR__MISSING_TRIGGER_PRICE
    | typeof PERPS_ERROR__ORACLE_PRICE_DIFFERENCE_TOO_LARGE
    | typeof PERPS_ERROR__ORACLE_PUBLISH_TIME_TOO_EARLY
    | typeof PERPS_ERROR__PERSONAL_POOL_AMOUNT_LIMIT
    | typeof PERPS_ERROR__POOL_AMOUNT_LIMIT
    | typeof PERPS_ERROR__POSITION_UPDATED_TOO_RECENT
    | typeof PERPS_ERROR__PRICE_DIFF_TOO_LARGE
    | typeof PERPS_ERROR__PROGRAM_MISMATCH
    | typeof PERPS_ERROR__PULL_ORACLE_NOT_VERIFIED
    | typeof PERPS_ERROR__PULL_ORACLE_PUBLISH_TIME_TOO_EARLY
    | typeof PERPS_ERROR__REQUEST_UPDATED_TOO_RECENT
    | typeof PERPS_ERROR__STALE_ORACLE_PRICE
    | typeof PERPS_ERROR__STALE_PULL_ORACLE_PRICE
    | typeof PERPS_ERROR__SWAP_AMOUNT_MISMATCH
    | typeof PERPS_ERROR__TRIGGER_PRICE_SLIPPAGE
    | typeof PERPS_ERROR__UNSUPPORTED_ORACLE
    | typeof PERPS_ERROR__UNSUPPORTED_TOKEN
    | typeof PERPS_ERROR__WITHDRAW_EXCEEDS_MARGIN_LIMITS;

export interface PerpsErrorInfo {
    code: PerpsError;
    name: string;
    message: string;
}

const PERPS_ERRORS: Readonly<Record<PerpsError, PerpsErrorInfo>> = {
    [PERPS_ERROR__MATH_OVERFLOW]: { code: 6000, name: 'mathOverflow', message: 'Overflow in arithmetic operation' },
    [PERPS_ERROR__UNSUPPORTED_ORACLE]: { code: 6001, name: 'unsupportedOracle', message: 'Unsupported price oracle' },
    [PERPS_ERROR__INVALID_ORACLE_ACCOUNT]: {
        code: 6002,
        name: 'invalidOracleAccount',
        message: 'Invalid oracle account',
    },
    [PERPS_ERROR__STALE_ORACLE_PRICE]: { code: 6003, name: 'staleOraclePrice', message: 'Stale oracle price' },
    [PERPS_ERROR__INVALID_ORACLE_PRICE]: { code: 6004, name: 'invalidOraclePrice', message: 'Invalid oracle price' },
    [PERPS_ERROR__INVALID_ENVIRONMENT]: {
        code: 6005,
        name: 'invalidEnvironment',
        message: 'Instruction is not allowed in production',
    },
    [PERPS_ERROR__INVALID_COLLATERAL_ACCOUNT]: {
        code: 6006,
        name: 'invalidCollateralAccount',
        message: 'Invalid collateral account',
    },
    [PERPS_ERROR__INVALID_COLLATERAL_AMOUNT]: {
        code: 6007,
        name: 'invalidCollateralAmount',
        message: 'Invalid collateral amount',
    },
    [PERPS_ERROR__COLLATERAL_SLIPPAGE]: { code: 6008, name: 'collateralSlippage', message: 'Collateral slippage' },
    [PERPS_ERROR__INVALID_POSITION_STATE]: {
        code: 6009,
        name: 'invalidPositionState',
        message: 'Invalid position state',
    },
    [PERPS_ERROR__INVALID_PERPETUALS_CONFIG]: {
        code: 6010,
        name: 'invalidPerpetualsConfig',
        message: 'Invalid perpetuals config',
    },
    [PERPS_ERROR__INVALID_POOL_CONFIG]: { code: 6011, name: 'invalidPoolConfig', message: 'Invalid pool config' },
    [PERPS_ERROR__INVALID_INSTRUCTION]: { code: 6012, name: 'invalidInstruction', message: 'Invalid instruction' },
    [PERPS_ERROR__INVALID_CUSTODY_CONFIG]: {
        code: 6013,
        name: 'invalidCustodyConfig',
        message: 'Invalid custody config',
    },
    [PERPS_ERROR__INVALID_CUSTODY_BALANCE]: {
        code: 6014,
        name: 'invalidCustodyBalance',
        message: 'Invalid custody balance',
    },
    [PERPS_ERROR__INVALID_ARGUMENT]: { code: 6015, name: 'invalidArgument', message: 'Invalid argument' },
    [PERPS_ERROR__INVALID_POSITION_REQUEST]: {
        code: 6016,
        name: 'invalidPositionRequest',
        message: 'Invalid position request',
    },
    [PERPS_ERROR__INVALID_POSITION_REQUEST_INPUT_ATA]: {
        code: 6017,
        name: 'invalidPositionRequestInputAta',
        message: 'Invalid position request input ata',
    },
    [PERPS_ERROR__INVALID_MINT]: { code: 6018, name: 'invalidMint', message: 'Invalid mint' },
    [PERPS_ERROR__INSUFFICIENT_TOKEN_AMOUNT]: {
        code: 6019,
        name: 'insufficientTokenAmount',
        message: 'Insufficient token amount',
    },
    [PERPS_ERROR__INSUFFICIENT_AMOUNT_RETURNED]: {
        code: 6020,
        name: 'insufficientAmountReturned',
        message: 'Insufficient token amount returned',
    },
    [PERPS_ERROR__MAX_PRICE_SLIPPAGE]: {
        code: 6021,
        name: 'maxPriceSlippage',
        message: 'Price slippage limit exceeded',
    },
    [PERPS_ERROR__MAX_LEVERAGE]: { code: 6022, name: 'maxLeverage', message: 'Position leverage limit exceeded' },
    [PERPS_ERROR__CUSTODY_AMOUNT_LIMIT]: {
        code: 6023,
        name: 'custodyAmountLimit',
        message: 'Custody amount limit exceeded',
    },
    [PERPS_ERROR__POOL_AMOUNT_LIMIT]: { code: 6024, name: 'poolAmountLimit', message: 'Pool amount limit exceeded' },
    [PERPS_ERROR__PERSONAL_POOL_AMOUNT_LIMIT]: {
        code: 6025,
        name: 'personalPoolAmountLimit',
        message: 'Personal pool amount limit exceeded',
    },
    [PERPS_ERROR__UNSUPPORTED_TOKEN]: { code: 6026, name: 'unsupportedToken', message: 'Token is not supported' },
    [PERPS_ERROR__INSTRUCTION_NOT_ALLOWED]: {
        code: 6027,
        name: 'instructionNotAllowed',
        message: 'Instruction is not allowed at this time',
    },
    [PERPS_ERROR__JUPITER_PROGRAM_MISMATCH]: {
        code: 6028,
        name: 'jupiterProgramMismatch',
        message: 'Jupiter Program ID mismatch',
    },
    [PERPS_ERROR__PROGRAM_MISMATCH]: { code: 6029, name: 'programMismatch', message: 'Program ID mismatch' },
    [PERPS_ERROR__ADDRESS_MISMATCH]: { code: 6030, name: 'addressMismatch', message: 'Address mismatch' },
    [PERPS_ERROR__KEEPER_A_T_A_MISSING]: { code: 6031, name: 'keeperATAMissing', message: 'Missing keeper ATA' },
    [PERPS_ERROR__SWAP_AMOUNT_MISMATCH]: { code: 6032, name: 'swapAmountMismatch', message: 'Swap amount mismatch' },
    [PERPS_ERROR__C_P_I_NOT_ALLOWED]: { code: 6033, name: 'cPINotAllowed', message: 'CPI not allowed' },
    [PERPS_ERROR__INVALID_KEEPER]: { code: 6034, name: 'invalidKeeper', message: 'Invalid Keeper' },
    [PERPS_ERROR__EXCEED_EXECUTION_PERIOD]: {
        code: 6035,
        name: 'exceedExecutionPeriod',
        message: 'Exceed execution period',
    },
    [PERPS_ERROR__INVALID_REQUEST_TYPE]: { code: 6036, name: 'invalidRequestType', message: 'Invalid Request Type' },
    [PERPS_ERROR__INVALID_TRIGGER_PRICE]: { code: 6037, name: 'invalidTriggerPrice', message: 'Invalid Trigger Price' },
    [PERPS_ERROR__TRIGGER_PRICE_SLIPPAGE]: {
        code: 6038,
        name: 'triggerPriceSlippage',
        message: 'Trigger Price Slippage',
    },
    [PERPS_ERROR__MISSING_TRIGGER_PRICE]: { code: 6039, name: 'missingTriggerPrice', message: 'Missing Trigger Price' },
    [PERPS_ERROR__MISSING_PRICE_SLIPPAGE]: {
        code: 6040,
        name: 'missingPriceSlippage',
        message: 'Missing Price Slippage',
    },
    [PERPS_ERROR__INVALID_PRICE_CALC_MODE]: {
        code: 6041,
        name: 'invalidPriceCalcMode',
        message: 'Invalid Price Calc Mode',
    },
    [PERPS_ERROR__REQUEST_UPDATED_TOO_RECENT]: {
        code: 6042,
        name: 'requestUpdatedTooRecent',
        message: 'Request Updated Too Recent',
    },
    [PERPS_ERROR__EXCEED_TOKEN_WEIGHTAGE]: {
        code: 6043,
        name: 'exceedTokenWeightage',
        message: 'Exceed Token Weightage',
    },
    [PERPS_ERROR__ORACLE_PUBLISH_TIME_TOO_EARLY]: {
        code: 6044,
        name: 'oraclePublishTimeTooEarly',
        message: 'Oracle Publish Time Too Early',
    },
    [PERPS_ERROR__PULL_ORACLE_PUBLISH_TIME_TOO_EARLY]: {
        code: 6045,
        name: 'pullOraclePublishTimeTooEarly',
        message: 'Pull Oracle Publish Time Too Early',
    },
    [PERPS_ERROR__STALE_PULL_ORACLE_PRICE]: {
        code: 6046,
        name: 'stalePullOraclePrice',
        message: 'Stale Pull Oracle Price',
    },
    [PERPS_ERROR__INVALID_PULL_ORACLE_PRICE]: {
        code: 6047,
        name: 'invalidPullOraclePrice',
        message: 'Invalid Pull Oracle Price',
    },
    [PERPS_ERROR__PULL_ORACLE_NOT_VERIFIED]: {
        code: 6048,
        name: 'pullOracleNotVerified',
        message: 'Pull Oracle Not Verified',
    },
    [PERPS_ERROR__PRICE_DIFF_TOO_LARGE]: {
        code: 6049,
        name: 'priceDiffTooLarge',
        message: 'Price Diff Between Pull and Push Oracle is Too Large',
    },
    [PERPS_ERROR__INVALID_DOVES_ORACLE_PRICE]: {
        code: 6050,
        name: 'invalidDovesOraclePrice',
        message: 'Invalid Doves Oracle Price',
    },
    [PERPS_ERROR__INVALID_REQUEST_TIME]: { code: 6051, name: 'invalidRequestTime', message: 'Invalid Request Time' },
    [PERPS_ERROR__POSITION_UPDATED_TOO_RECENT]: {
        code: 6052,
        name: 'positionUpdatedTooRecent',
        message: 'Position Updated Too Recent',
    },
    [PERPS_ERROR__LEDGER_TOKEN_ACCOUNT_DOES_NOT_MATCH]: {
        code: 6053,
        name: 'ledgerTokenAccountDoesNotMatch',
        message: 'Ledger token account does not match',
    },
    [PERPS_ERROR__INVALID_TOKEN_LEDGER]: { code: 6054, name: 'invalidTokenLedger', message: 'Invalid token ledger' },
    [PERPS_ERROR__ORACLE_PRICE_DIFFERENCE_TOO_LARGE]: {
        code: 6055,
        name: 'oraclePriceDifferenceTooLarge',
        message: 'Oracle Price Difference Too Large',
    },
    [PERPS_ERROR__INVALID_ORACLE_SIGNER]: { code: 6056, name: 'invalidOracleSigner', message: 'Invalid Oracle Signer' },
    [PERPS_ERROR__INVALID_ORACLE_TIMESTAMP]: {
        code: 6057,
        name: 'invalidOracleTimestamp',
        message: 'Invalid Oracle Timestamp',
    },
    [PERPS_ERROR__INVALID_MAX_GLOBAL_LONG_SIZE]: {
        code: 6058,
        name: 'invalidMaxGlobalLongSize',
        message: 'New Max Global Long Size Too Low',
    },
    [PERPS_ERROR__INVALID_MAX_GLOBAL_SHORT_SIZE]: {
        code: 6059,
        name: 'invalidMaxGlobalShortSize',
        message: 'New Max Global Short Size Too Low',
    },
    [PERPS_ERROR__BORROWS_DISABLED]: {
        code: 6060,
        name: 'borrowsDisabled',
        message: 'Borrows disabled for this custody',
    },
    [PERPS_ERROR__BORROW_LIMITS_EXCEEDED]: {
        code: 6061,
        name: 'borrowLimitsExceeded',
        message: 'Borrows limit exceeded for this custody',
    },
    [PERPS_ERROR__WITHDRAW_EXCEEDS_MARGIN_LIMITS]: {
        code: 6062,
        name: 'withdrawExceedsMarginLimits',
        message: 'Withdraw exceeds margin of the custody',
    },
    [PERPS_ERROR__CANNOT_LIQUIDATE]: { code: 6063, name: 'cannotLiquidate', message: 'Cannot liquidate' },
    [PERPS_ERROR__CANNOT_DELEGATE_STAKE]: {
        code: 6064,
        name: 'cannotDelegateStake',
        message: 'Cannot delegate stake to deactivated account',
    },
    [PERPS_ERROR__EXCEEDED_MAX_TOTAL_STAKED_AMOUNT]: {
        code: 6065,
        name: 'exceededMaxTotalStakedAmount',
        message: 'Max total staked amount exceeded',
    },
    [PERPS_ERROR__LP_TOKEN_PRICE_CHANGE_LIMIT_EXCEEDED]: {
        code: 6066,
        name: 'lpTokenPriceChangeLimitExceeded',
        message: 'LP token price change exceeds limit',
    },
};

export function getPerpsErrorFromCode(code: number): PerpsErrorInfo | undefined {
    return PERPS_ERRORS[code as PerpsError];
}

export function getPerpsErrorMessage(code: PerpsError): string {
    return PERPS_ERRORS[code].message;
}
