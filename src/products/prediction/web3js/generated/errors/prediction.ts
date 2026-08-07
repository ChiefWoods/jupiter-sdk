export const PREDICTION_ERROR__INVALID_ADMIN = 0x1770; // 6000
export const PREDICTION_ERROR__INVALID_A_P_I_AUTHORITY = 0x1771; // 6001
export const PREDICTION_ERROR__INVALID_KEEPER = 0x1772; // 6002
export const PREDICTION_ERROR__INVALID_MINT = 0x1773; // 6003
export const PREDICTION_ERROR__INVALID_VAULT_CONFIG = 0x1774; // 6004
export const PREDICTION_ERROR__INVALID_DEFAULTS = 0x1775; // 6005
export const PREDICTION_ERROR__DEPOSITS_DISABLED = 0x1776; // 6006
export const PREDICTION_ERROR__WITHDRAWALS_DISABLED = 0x1777; // 6007
export const PREDICTION_ERROR__TRADING_DISABLED = 0x1778; // 6008
export const PREDICTION_ERROR__INVALID_MAX_CONTRACTS = 0x1779; // 6009
export const PREDICTION_ERROR__INVALID_MAX_OPEN_ORDERS = 0x177a; // 6010
export const PREDICTION_ERROR__INVALID_FEE = 0x177b; // 6011
export const PREDICTION_ERROR__CONTRACTS_BELOW_MINIMUM = 0x177c; // 6012
export const PREDICTION_ERROR__EVENT_CREATION_DISABLED = 0x177d; // 6013
export const PREDICTION_ERROR__MARKET_CREATION_DISABLED = 0x177e; // 6014
export const PREDICTION_ERROR__MAX_EVENTS_EXCEEDED = 0x177f; // 6015
export const PREDICTION_ERROR__MATH_OVERFLOW = 0x1780; // 6016
export const PREDICTION_ERROR__INVALID_EXPIRY_TIME = 0x1781; // 6017
export const PREDICTION_ERROR__INVALID_EVENT_UPDATE = 0x1782; // 6018
export const PREDICTION_ERROR__EVENT_ALREADY_EXISTS = 0x1783; // 6019
export const PREDICTION_ERROR__INVALID_SETTLEMENT_TIME = 0x1784; // 6020
export const PREDICTION_ERROR__INVALID_OPEN_TIME = 0x1785; // 6021
export const PREDICTION_ERROR__INVALID_CLOSE_TIME = 0x1786; // 6022
export const PREDICTION_ERROR__INVALID_EVENT = 0x1787; // 6023
export const PREDICTION_ERROR__MARKET_ALREADY_SETTLED = 0x1788; // 6024
export const PREDICTION_ERROR__MARKET_NOT_CLOSED = 0x1789; // 6025
export const PREDICTION_ERROR__MARKET_NOT_OPEN = 0x178a; // 6026
export const PREDICTION_ERROR__MARKET_NOT_SETTLED = 0x178b; // 6027
export const PREDICTION_ERROR__INVALID_STATUS_TRANSITION = 0x178c; // 6028
export const PREDICTION_ERROR__EXCEEDS_GLOBAL_LIMIT = 0x178d; // 6029
export const PREDICTION_ERROR__INVALID_MARKET_STATUS = 0x178e; // 6030
export const PREDICTION_ERROR__EVENT_ALREADY_EXPIRED = 0x178f; // 6031
export const PREDICTION_ERROR__EVENT_ALREADY_RESOLVED = 0x1790; // 6032
export const PREDICTION_ERROR__EVENT_ALREADY_CANCELLED = 0x1791; // 6033
export const PREDICTION_ERROR__INVALID_ARGUMENT = 0x1792; // 6034
export const PREDICTION_ERROR__INVALID_POSITION = 0x1793; // 6035
export const PREDICTION_ERROR__TOO_MANY_OPEN_ORDERS = 0x1794; // 6036
export const PREDICTION_ERROR__INVALID_TOKEN_ACCOUNT = 0x1795; // 6037
export const PREDICTION_ERROR__INVALID_POSITION_OWNER = 0x1796; // 6038
export const PREDICTION_ERROR__INVALID_DEPOSIT_AMOUNT = 0x1797; // 6039
export const PREDICTION_ERROR__INSUFFICIENT_FUNDS = 0x1798; // 6040
export const PREDICTION_ERROR__DEPOSIT_NOT_ALLOWED_FOR_SELLS = 0x1799; // 6041
export const PREDICTION_ERROR__DEPOSIT_BELOW_MINIMUM = 0x179a; // 6042
export const PREDICTION_ERROR__INSUFFICIENT_CONTRACTS = 0x179b; // 6043
export const PREDICTION_ERROR__POSITION_MAX_CONTRACTS_EXCEEDED = 0x179c; // 6044
export const PREDICTION_ERROR__GLOBAL_MAX_CONTRACTS_EXCEEDED = 0x179d; // 6045
export const PREDICTION_ERROR__INVALID_OWNER = 0x179e; // 6046
export const PREDICTION_ERROR__INVALID_FILL = 0x179f; // 6047
export const PREDICTION_ERROR__INVALID_FILL_PRICE = 0x17a0; // 6048
export const PREDICTION_ERROR__MARKET_STILL_OPEN = 0x17a1; // 6049
export const PREDICTION_ERROR__INVALID_ORDER = 0x17a2; // 6050
export const PREDICTION_ERROR__MISSING_FILL_DATA = 0x17a3; // 6051
export const PREDICTION_ERROR__PARTIAL_FILL_NOT_ALLOWED = 0x17a4; // 6052
export const PREDICTION_ERROR__FILL_PRICE_EXCEEDS_LIMIT = 0x17a5; // 6053
export const PREDICTION_ERROR__INSUFFICIENT_VAULT_FUNDS = 0x17a6; // 6054
export const PREDICTION_ERROR__ORDER_NOT_FAILED = 0x17a7; // 6055
export const PREDICTION_ERROR__MARKET_NOT_RESOLVED = 0x17a8; // 6056
export const PREDICTION_ERROR__PAYOUT_ALREADY_CLAIMED = 0x17a9; // 6057
export const PREDICTION_ERROR__INSUFFICIENT_VAULT_BALANCE = 0x17aa; // 6058
export const PREDICTION_ERROR__SETTLEMENT_DELAY_NOT_PASSED = 0x17ab; // 6059
export const PREDICTION_ERROR__CLAIMS_NOT_ENABLED = 0x17ac; // 6060
export const PREDICTION_ERROR__INVALID_MARKET_RESULT = 0x17ad; // 6061
export const PREDICTION_ERROR__POSITION_OPENED_AFTER_SETTLEMENT = 0x17ae; // 6062
export const PREDICTION_ERROR__INVALID_INTEGRATOR_FEE = 0x17af; // 6063
export const PREDICTION_ERROR__INVALID_INTEGRATOR_TOKEN_ACCOUNT = 0x17b0; // 6064
export const PREDICTION_ERROR__POSITION_NOT_CLOSABLE = 0x17b1; // 6065
export const PREDICTION_ERROR__MIGRATION_STATE_MISMATCH = 0x17b2; // 6066
export const PREDICTION_ERROR__INVALID_CONTRACT_UNIT_VERSION = 0x17b3; // 6067
export const PREDICTION_ERROR__INVALID_TICKET = 0x17b4; // 6068
export const PREDICTION_ERROR__TICKET_NOT_CLAIMABLE = 0x17b5; // 6069
export const PREDICTION_ERROR__TICKET_REFUND_WINDOW_EXPIRED = 0x17b6; // 6070

export type PredictionError =
    | typeof PREDICTION_ERROR__CLAIMS_NOT_ENABLED
    | typeof PREDICTION_ERROR__CONTRACTS_BELOW_MINIMUM
    | typeof PREDICTION_ERROR__DEPOSIT_BELOW_MINIMUM
    | typeof PREDICTION_ERROR__DEPOSIT_NOT_ALLOWED_FOR_SELLS
    | typeof PREDICTION_ERROR__DEPOSITS_DISABLED
    | typeof PREDICTION_ERROR__EVENT_ALREADY_CANCELLED
    | typeof PREDICTION_ERROR__EVENT_ALREADY_EXISTS
    | typeof PREDICTION_ERROR__EVENT_ALREADY_EXPIRED
    | typeof PREDICTION_ERROR__EVENT_ALREADY_RESOLVED
    | typeof PREDICTION_ERROR__EVENT_CREATION_DISABLED
    | typeof PREDICTION_ERROR__EXCEEDS_GLOBAL_LIMIT
    | typeof PREDICTION_ERROR__FILL_PRICE_EXCEEDS_LIMIT
    | typeof PREDICTION_ERROR__GLOBAL_MAX_CONTRACTS_EXCEEDED
    | typeof PREDICTION_ERROR__INSUFFICIENT_CONTRACTS
    | typeof PREDICTION_ERROR__INSUFFICIENT_FUNDS
    | typeof PREDICTION_ERROR__INSUFFICIENT_VAULT_BALANCE
    | typeof PREDICTION_ERROR__INSUFFICIENT_VAULT_FUNDS
    | typeof PREDICTION_ERROR__INVALID_ADMIN
    | typeof PREDICTION_ERROR__INVALID_A_P_I_AUTHORITY
    | typeof PREDICTION_ERROR__INVALID_ARGUMENT
    | typeof PREDICTION_ERROR__INVALID_CLOSE_TIME
    | typeof PREDICTION_ERROR__INVALID_CONTRACT_UNIT_VERSION
    | typeof PREDICTION_ERROR__INVALID_DEFAULTS
    | typeof PREDICTION_ERROR__INVALID_DEPOSIT_AMOUNT
    | typeof PREDICTION_ERROR__INVALID_EVENT
    | typeof PREDICTION_ERROR__INVALID_EVENT_UPDATE
    | typeof PREDICTION_ERROR__INVALID_EXPIRY_TIME
    | typeof PREDICTION_ERROR__INVALID_FEE
    | typeof PREDICTION_ERROR__INVALID_FILL
    | typeof PREDICTION_ERROR__INVALID_FILL_PRICE
    | typeof PREDICTION_ERROR__INVALID_INTEGRATOR_FEE
    | typeof PREDICTION_ERROR__INVALID_INTEGRATOR_TOKEN_ACCOUNT
    | typeof PREDICTION_ERROR__INVALID_KEEPER
    | typeof PREDICTION_ERROR__INVALID_MARKET_RESULT
    | typeof PREDICTION_ERROR__INVALID_MARKET_STATUS
    | typeof PREDICTION_ERROR__INVALID_MAX_CONTRACTS
    | typeof PREDICTION_ERROR__INVALID_MAX_OPEN_ORDERS
    | typeof PREDICTION_ERROR__INVALID_MINT
    | typeof PREDICTION_ERROR__INVALID_OPEN_TIME
    | typeof PREDICTION_ERROR__INVALID_ORDER
    | typeof PREDICTION_ERROR__INVALID_OWNER
    | typeof PREDICTION_ERROR__INVALID_POSITION
    | typeof PREDICTION_ERROR__INVALID_POSITION_OWNER
    | typeof PREDICTION_ERROR__INVALID_SETTLEMENT_TIME
    | typeof PREDICTION_ERROR__INVALID_STATUS_TRANSITION
    | typeof PREDICTION_ERROR__INVALID_TICKET
    | typeof PREDICTION_ERROR__INVALID_TOKEN_ACCOUNT
    | typeof PREDICTION_ERROR__INVALID_VAULT_CONFIG
    | typeof PREDICTION_ERROR__MARKET_ALREADY_SETTLED
    | typeof PREDICTION_ERROR__MARKET_CREATION_DISABLED
    | typeof PREDICTION_ERROR__MARKET_NOT_CLOSED
    | typeof PREDICTION_ERROR__MARKET_NOT_OPEN
    | typeof PREDICTION_ERROR__MARKET_NOT_RESOLVED
    | typeof PREDICTION_ERROR__MARKET_NOT_SETTLED
    | typeof PREDICTION_ERROR__MARKET_STILL_OPEN
    | typeof PREDICTION_ERROR__MATH_OVERFLOW
    | typeof PREDICTION_ERROR__MAX_EVENTS_EXCEEDED
    | typeof PREDICTION_ERROR__MIGRATION_STATE_MISMATCH
    | typeof PREDICTION_ERROR__MISSING_FILL_DATA
    | typeof PREDICTION_ERROR__ORDER_NOT_FAILED
    | typeof PREDICTION_ERROR__PARTIAL_FILL_NOT_ALLOWED
    | typeof PREDICTION_ERROR__PAYOUT_ALREADY_CLAIMED
    | typeof PREDICTION_ERROR__POSITION_MAX_CONTRACTS_EXCEEDED
    | typeof PREDICTION_ERROR__POSITION_NOT_CLOSABLE
    | typeof PREDICTION_ERROR__POSITION_OPENED_AFTER_SETTLEMENT
    | typeof PREDICTION_ERROR__SETTLEMENT_DELAY_NOT_PASSED
    | typeof PREDICTION_ERROR__TICKET_NOT_CLAIMABLE
    | typeof PREDICTION_ERROR__TICKET_REFUND_WINDOW_EXPIRED
    | typeof PREDICTION_ERROR__TOO_MANY_OPEN_ORDERS
    | typeof PREDICTION_ERROR__TRADING_DISABLED
    | typeof PREDICTION_ERROR__WITHDRAWALS_DISABLED;

export interface PredictionErrorInfo {
    code: PredictionError;
    name: string;
    message: string;
}

const PREDICTION_ERRORS: Readonly<Record<PredictionError, PredictionErrorInfo>> = {
    [PREDICTION_ERROR__INVALID_ADMIN]: { code: 6000, name: 'invalidAdmin', message: 'Invalid admin' },
    [PREDICTION_ERROR__INVALID_A_P_I_AUTHORITY]: {
        code: 6001,
        name: 'invalidAPIAuthority',
        message: 'Invalid API authority',
    },
    [PREDICTION_ERROR__INVALID_KEEPER]: { code: 6002, name: 'invalidKeeper', message: 'Invalid keeper' },
    [PREDICTION_ERROR__INVALID_MINT]: { code: 6003, name: 'invalidMint', message: 'Invalid mint' },
    [PREDICTION_ERROR__INVALID_VAULT_CONFIG]: {
        code: 6004,
        name: 'invalidVaultConfig',
        message: 'Invalid vault config',
    },
    [PREDICTION_ERROR__INVALID_DEFAULTS]: { code: 6005, name: 'invalidDefaults', message: 'Invalid defaults' },
    [PREDICTION_ERROR__DEPOSITS_DISABLED]: { code: 6006, name: 'depositsDisabled', message: 'Deposits disabled' },
    [PREDICTION_ERROR__WITHDRAWALS_DISABLED]: {
        code: 6007,
        name: 'withdrawalsDisabled',
        message: 'Withdrawals disabled',
    },
    [PREDICTION_ERROR__TRADING_DISABLED]: { code: 6008, name: 'tradingDisabled', message: 'Trading disabled' },
    [PREDICTION_ERROR__INVALID_MAX_CONTRACTS]: {
        code: 6009,
        name: 'invalidMaxContracts',
        message: 'Invalid max contracts',
    },
    [PREDICTION_ERROR__INVALID_MAX_OPEN_ORDERS]: {
        code: 6010,
        name: 'invalidMaxOpenOrders',
        message: 'Invalid max open orders',
    },
    [PREDICTION_ERROR__INVALID_FEE]: { code: 6011, name: 'invalidFee', message: 'Invalid fee' },
    [PREDICTION_ERROR__CONTRACTS_BELOW_MINIMUM]: {
        code: 6012,
        name: 'contractsBelowMinimum',
        message: 'Contracts below minimum',
    },
    [PREDICTION_ERROR__EVENT_CREATION_DISABLED]: {
        code: 6013,
        name: 'eventCreationDisabled',
        message: 'Event creation disabled',
    },
    [PREDICTION_ERROR__MARKET_CREATION_DISABLED]: {
        code: 6014,
        name: 'marketCreationDisabled',
        message: 'Market creation disabled',
    },
    [PREDICTION_ERROR__MAX_EVENTS_EXCEEDED]: { code: 6015, name: 'maxEventsExceeded', message: 'Max events exceeded' },
    [PREDICTION_ERROR__MATH_OVERFLOW]: { code: 6016, name: 'mathOverflow', message: 'Math overflow' },
    [PREDICTION_ERROR__INVALID_EXPIRY_TIME]: { code: 6017, name: 'invalidExpiryTime', message: 'Invalid expiry time' },
    [PREDICTION_ERROR__INVALID_EVENT_UPDATE]: {
        code: 6018,
        name: 'invalidEventUpdate',
        message: 'Invalid event update - event is finalized or immutable',
    },
    [PREDICTION_ERROR__EVENT_ALREADY_EXISTS]: {
        code: 6019,
        name: 'eventAlreadyExists',
        message: 'Event already exists',
    },
    [PREDICTION_ERROR__INVALID_SETTLEMENT_TIME]: {
        code: 6020,
        name: 'invalidSettlementTime',
        message: 'Invalid settlement time',
    },
    [PREDICTION_ERROR__INVALID_OPEN_TIME]: { code: 6021, name: 'invalidOpenTime', message: 'Invalid open time' },
    [PREDICTION_ERROR__INVALID_CLOSE_TIME]: { code: 6022, name: 'invalidCloseTime', message: 'Invalid close time' },
    [PREDICTION_ERROR__INVALID_EVENT]: { code: 6023, name: 'invalidEvent', message: 'Invalid event' },
    [PREDICTION_ERROR__MARKET_ALREADY_SETTLED]: {
        code: 6024,
        name: 'marketAlreadySettled',
        message: 'Market already settled',
    },
    [PREDICTION_ERROR__MARKET_NOT_CLOSED]: { code: 6025, name: 'marketNotClosed', message: 'Market not closed' },
    [PREDICTION_ERROR__MARKET_NOT_OPEN]: { code: 6026, name: 'marketNotOpen', message: 'Market not open' },
    [PREDICTION_ERROR__MARKET_NOT_SETTLED]: { code: 6027, name: 'marketNotSettled', message: 'Market not settled' },
    [PREDICTION_ERROR__INVALID_STATUS_TRANSITION]: {
        code: 6028,
        name: 'invalidStatusTransition',
        message: 'Invalid status transition',
    },
    [PREDICTION_ERROR__EXCEEDS_GLOBAL_LIMIT]: {
        code: 6029,
        name: 'exceedsGlobalLimit',
        message: 'Exceeds global limit',
    },
    [PREDICTION_ERROR__INVALID_MARKET_STATUS]: {
        code: 6030,
        name: 'invalidMarketStatus',
        message: 'Invalid market status',
    },
    [PREDICTION_ERROR__EVENT_ALREADY_EXPIRED]: {
        code: 6031,
        name: 'eventAlreadyExpired',
        message: 'Event already expired',
    },
    [PREDICTION_ERROR__EVENT_ALREADY_RESOLVED]: {
        code: 6032,
        name: 'eventAlreadyResolved',
        message: 'Event already resolved',
    },
    [PREDICTION_ERROR__EVENT_ALREADY_CANCELLED]: {
        code: 6033,
        name: 'eventAlreadyCancelled',
        message: 'Event already cancelled',
    },
    [PREDICTION_ERROR__INVALID_ARGUMENT]: { code: 6034, name: 'invalidArgument', message: 'Invalid argument' },
    [PREDICTION_ERROR__INVALID_POSITION]: { code: 6035, name: 'invalidPosition', message: 'Invalid argument' },
    [PREDICTION_ERROR__TOO_MANY_OPEN_ORDERS]: {
        code: 6036,
        name: 'tooManyOpenOrders',
        message: 'Too many open orders',
    },
    [PREDICTION_ERROR__INVALID_TOKEN_ACCOUNT]: {
        code: 6037,
        name: 'invalidTokenAccount',
        message: 'Invalid token account owner',
    },
    [PREDICTION_ERROR__INVALID_POSITION_OWNER]: {
        code: 6038,
        name: 'invalidPositionOwner',
        message: 'Position owner mismatch',
    },
    [PREDICTION_ERROR__INVALID_DEPOSIT_AMOUNT]: {
        code: 6039,
        name: 'invalidDepositAmount',
        message: 'Invalid deposit amount',
    },
    [PREDICTION_ERROR__INSUFFICIENT_FUNDS]: { code: 6040, name: 'insufficientFunds', message: 'Insufficient funds' },
    [PREDICTION_ERROR__DEPOSIT_NOT_ALLOWED_FOR_SELLS]: {
        code: 6041,
        name: 'depositNotAllowedForSells',
        message: 'Deposit not allowed for sell orders',
    },
    [PREDICTION_ERROR__DEPOSIT_BELOW_MINIMUM]: {
        code: 6042,
        name: 'depositBelowMinimum',
        message: 'Deposit amount must be at least $1',
    },
    [PREDICTION_ERROR__INSUFFICIENT_CONTRACTS]: {
        code: 6043,
        name: 'insufficientContracts',
        message: 'Insufficient contracts',
    },
    [PREDICTION_ERROR__POSITION_MAX_CONTRACTS_EXCEEDED]: {
        code: 6044,
        name: 'positionMaxContractsExceeded',
        message: 'Position max contracts limit exceeded',
    },
    [PREDICTION_ERROR__GLOBAL_MAX_CONTRACTS_EXCEEDED]: {
        code: 6045,
        name: 'globalMaxContractsExceeded',
        message: 'Global max contracts limit exceeded',
    },
    [PREDICTION_ERROR__INVALID_OWNER]: { code: 6046, name: 'invalidOwner', message: 'Invalid owner' },
    [PREDICTION_ERROR__INVALID_FILL]: {
        code: 6047,
        name: 'invalidFill',
        message: 'Invalid fill data - contracts or price is zero',
    },
    [PREDICTION_ERROR__INVALID_FILL_PRICE]: { code: 6048, name: 'invalidFillPrice', message: 'Invalid fill price' },
    [PREDICTION_ERROR__MARKET_STILL_OPEN]: {
        code: 6049,
        name: 'marketStillOpen',
        message: 'Market still open (before close time)',
    },
    [PREDICTION_ERROR__INVALID_ORDER]: { code: 6050, name: 'invalidOrder', message: 'Invalid order' },
    [PREDICTION_ERROR__MISSING_FILL_DATA]: { code: 6051, name: 'missingFillData', message: 'Missing fill data' },
    [PREDICTION_ERROR__PARTIAL_FILL_NOT_ALLOWED]: {
        code: 6052,
        name: 'partialFillNotAllowed',
        message: 'Partial fills not allowed (FOK orders only)',
    },
    [PREDICTION_ERROR__FILL_PRICE_EXCEEDS_LIMIT]: {
        code: 6053,
        name: 'fillPriceExceedsLimit',
        message: "Fill price exceeds user's limit",
    },
    [PREDICTION_ERROR__INSUFFICIENT_VAULT_FUNDS]: {
        code: 6054,
        name: 'insufficientVaultFunds',
        message: 'Insufficient vault funds',
    },
    [PREDICTION_ERROR__ORDER_NOT_FAILED]: { code: 6055, name: 'orderNotFailed', message: 'Order is not failed' },
    [PREDICTION_ERROR__MARKET_NOT_RESOLVED]: { code: 6056, name: 'marketNotResolved', message: 'Market not resolved' },
    [PREDICTION_ERROR__PAYOUT_ALREADY_CLAIMED]: {
        code: 6057,
        name: 'payoutAlreadyClaimed',
        message: 'Payout already claimed',
    },
    [PREDICTION_ERROR__INSUFFICIENT_VAULT_BALANCE]: {
        code: 6058,
        name: 'insufficientVaultBalance',
        message: 'Insufficient vault balance',
    },
    [PREDICTION_ERROR__SETTLEMENT_DELAY_NOT_PASSED]: {
        code: 6059,
        name: 'settlementDelayNotPassed',
        message: 'Settlement delay not passed',
    },
    [PREDICTION_ERROR__CLAIMS_NOT_ENABLED]: { code: 6060, name: 'claimsNotEnabled', message: 'Claims not enabled' },
    [PREDICTION_ERROR__INVALID_MARKET_RESULT]: {
        code: 6061,
        name: 'invalidMarketResult',
        message: 'Invalid market result',
    },
    [PREDICTION_ERROR__POSITION_OPENED_AFTER_SETTLEMENT]: {
        code: 6062,
        name: 'positionOpenedAfterSettlement',
        message: 'Position opened after settlement time',
    },
    [PREDICTION_ERROR__INVALID_INTEGRATOR_FEE]: {
        code: 6063,
        name: 'invalidIntegratorFee',
        message: 'Invalid integrator fee',
    },
    [PREDICTION_ERROR__INVALID_INTEGRATOR_TOKEN_ACCOUNT]: {
        code: 6064,
        name: 'invalidIntegratorTokenAccount',
        message: 'Invalid integrator token account',
    },
    [PREDICTION_ERROR__POSITION_NOT_CLOSABLE]: {
        code: 6065,
        name: 'positionNotClosable',
        message: 'Position cannot be closed - has active contracts or open orders',
    },
    [PREDICTION_ERROR__MIGRATION_STATE_MISMATCH]: {
        code: 6066,
        name: 'migrationStateMismatch',
        message: 'Migration state mismatch - account may already be migrated',
    },
    [PREDICTION_ERROR__INVALID_CONTRACT_UNIT_VERSION]: {
        code: 6067,
        name: 'invalidContractUnitVersion',
        message: 'Invalid contract unit version',
    },
    [PREDICTION_ERROR__INVALID_TICKET]: { code: 6068, name: 'invalidTicket', message: 'Invalid ticket' },
    [PREDICTION_ERROR__TICKET_NOT_CLAIMABLE]: {
        code: 6069,
        name: 'ticketNotClaimable',
        message: 'Ticket is not claimable yet',
    },
    [PREDICTION_ERROR__TICKET_REFUND_WINDOW_EXPIRED]: {
        code: 6070,
        name: 'ticketRefundWindowExpired',
        message: 'Ticket refund window expired',
    },
};

export function getPredictionErrorFromCode(code: number): PredictionErrorInfo | undefined {
    return PREDICTION_ERRORS[code as PredictionError];
}

export function getPredictionErrorMessage(code: PredictionError): string {
    return PREDICTION_ERRORS[code].message;
}
