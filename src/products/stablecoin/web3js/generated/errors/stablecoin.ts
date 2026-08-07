export const STABLECOIN_ERROR__SOME_ERROR = 0x1770; // 6000
export const STABLECOIN_ERROR__ADMIN_ARRAY_FULL = 0x1771; // 6001
export const STABLECOIN_ERROR__NOT_AUTHORIZED = 0x1772; // 6002
export const STABLECOIN_ERROR__BAD_INPUT = 0x1773; // 6003
export const STABLECOIN_ERROR__BENEFACTOR_DISABLED = 0x1774; // 6004
export const STABLECOIN_ERROR__BENEFACTOR_ACTIVE = 0x1775; // 6005
export const STABLECOIN_ERROR__VAULT_NOT_ACTIVE = 0x1776; // 6006
export const STABLECOIN_ERROR__INSUFFICIENT_AMOUNT = 0x1777; // 6007
export const STABLECOIN_ERROR__INVALID_FEE_RATE = 0x1778; // 6008
export const STABLECOIN_ERROR__MINT_LIMIT_EXCEEDED = 0x1779; // 6009
export const STABLECOIN_ERROR__REDEEM_LIMIT_EXCEEDED = 0x177a; // 6010
export const STABLECOIN_ERROR__SLIPPAGE_TOLERANCE_EXCEEDED = 0x177b; // 6011
export const STABLECOIN_ERROR__MATH_OVERFLOW = 0x177c; // 6012
export const STABLECOIN_ERROR__INVALID_L_P_MINT = 0x177d; // 6013
export const STABLECOIN_ERROR__INVALID_VAULT_MINT = 0x177e; // 6014
export const STABLECOIN_ERROR__INVALID_AUTHORITY = 0x177f; // 6015
export const STABLECOIN_ERROR__INVALID_VAULT_TOKEN_ACCOUNT = 0x1780; // 6016
export const STABLECOIN_ERROR__INVALID_TOKEN_PROGRAM = 0x1781; // 6017
export const STABLECOIN_ERROR__INVALID_VAULT_FEE_TOKEN_ACCOUNT = 0x1782; // 6018
export const STABLECOIN_ERROR__BAD_ORACLE = 0x1783; // 6019
export const STABLECOIN_ERROR__NO_VALID_PRICE = 0x1784; // 6020
export const STABLECOIN_ERROR__INVALID_BENEFACTOR = 0x1785; // 6021
export const STABLECOIN_ERROR__INVALID_CUSTODIAN = 0x1786; // 6022
export const STABLECOIN_ERROR__INVALID_PERIOD_LIMIT = 0x1787; // 6023
export const STABLECOIN_ERROR__MISSING_ORACLE_ACCOUNTS = 0x1788; // 6024
export const STABLECOIN_ERROR__NO_ORACLES_FOUND = 0x1789; // 6025
export const STABLECOIN_ERROR__ZERO_AMOUNT = 0x178a; // 6026
export const STABLECOIN_ERROR__PROTOCOL_PAUSED = 0x178b; // 6027
export const STABLECOIN_ERROR__OPERATOR_DISABLED = 0x178c; // 6028
export const STABLECOIN_ERROR__VAULT_DISABLED = 0x178d; // 6029
export const STABLECOIN_ERROR__VAULT_ENABLED = 0x178e; // 6030
export const STABLECOIN_ERROR__VAULT_IS_DRY = 0x178f; // 6031
export const STABLECOIN_ERROR__INVALID_PEG_PRICE_U_S_D = 0x1790; // 6032
export const STABLECOIN_ERROR__NO_VALID_ORACLE = 0x1791; // 6033
export const STABLECOIN_ERROR__PRICE_CONFIDENCE_TOO_WIDE = 0x1792; // 6034
export const STABLECOIN_ERROR__OPERATOR_CANNOT_DELETE_ITSELF = 0x1793; // 6035

export type StablecoinError =
    | typeof STABLECOIN_ERROR__ADMIN_ARRAY_FULL
    | typeof STABLECOIN_ERROR__BAD_INPUT
    | typeof STABLECOIN_ERROR__BAD_ORACLE
    | typeof STABLECOIN_ERROR__BENEFACTOR_ACTIVE
    | typeof STABLECOIN_ERROR__BENEFACTOR_DISABLED
    | typeof STABLECOIN_ERROR__INSUFFICIENT_AMOUNT
    | typeof STABLECOIN_ERROR__INVALID_AUTHORITY
    | typeof STABLECOIN_ERROR__INVALID_BENEFACTOR
    | typeof STABLECOIN_ERROR__INVALID_CUSTODIAN
    | typeof STABLECOIN_ERROR__INVALID_FEE_RATE
    | typeof STABLECOIN_ERROR__INVALID_L_P_MINT
    | typeof STABLECOIN_ERROR__INVALID_PEG_PRICE_U_S_D
    | typeof STABLECOIN_ERROR__INVALID_PERIOD_LIMIT
    | typeof STABLECOIN_ERROR__INVALID_TOKEN_PROGRAM
    | typeof STABLECOIN_ERROR__INVALID_VAULT_FEE_TOKEN_ACCOUNT
    | typeof STABLECOIN_ERROR__INVALID_VAULT_MINT
    | typeof STABLECOIN_ERROR__INVALID_VAULT_TOKEN_ACCOUNT
    | typeof STABLECOIN_ERROR__MATH_OVERFLOW
    | typeof STABLECOIN_ERROR__MINT_LIMIT_EXCEEDED
    | typeof STABLECOIN_ERROR__MISSING_ORACLE_ACCOUNTS
    | typeof STABLECOIN_ERROR__NO_ORACLES_FOUND
    | typeof STABLECOIN_ERROR__NOT_AUTHORIZED
    | typeof STABLECOIN_ERROR__NO_VALID_ORACLE
    | typeof STABLECOIN_ERROR__NO_VALID_PRICE
    | typeof STABLECOIN_ERROR__OPERATOR_CANNOT_DELETE_ITSELF
    | typeof STABLECOIN_ERROR__OPERATOR_DISABLED
    | typeof STABLECOIN_ERROR__PRICE_CONFIDENCE_TOO_WIDE
    | typeof STABLECOIN_ERROR__PROTOCOL_PAUSED
    | typeof STABLECOIN_ERROR__REDEEM_LIMIT_EXCEEDED
    | typeof STABLECOIN_ERROR__SLIPPAGE_TOLERANCE_EXCEEDED
    | typeof STABLECOIN_ERROR__SOME_ERROR
    | typeof STABLECOIN_ERROR__VAULT_DISABLED
    | typeof STABLECOIN_ERROR__VAULT_ENABLED
    | typeof STABLECOIN_ERROR__VAULT_IS_DRY
    | typeof STABLECOIN_ERROR__VAULT_NOT_ACTIVE
    | typeof STABLECOIN_ERROR__ZERO_AMOUNT;

export interface StablecoinErrorInfo {
    code: StablecoinError;
    name: string;
    message: string;
}

const STABLECOIN_ERRORS: Readonly<Record<StablecoinError, StablecoinErrorInfo>> = {
    [STABLECOIN_ERROR__SOME_ERROR]: { code: 6000, name: 'someError', message: '' },
    [STABLECOIN_ERROR__ADMIN_ARRAY_FULL]: { code: 6001, name: 'adminArrayFull', message: 'Admin Array Full' },
    [STABLECOIN_ERROR__NOT_AUTHORIZED]: { code: 6002, name: 'notAuthorized', message: 'Not Authorized' },
    [STABLECOIN_ERROR__BAD_INPUT]: { code: 6003, name: 'badInput', message: 'Bad Input' },
    [STABLECOIN_ERROR__BENEFACTOR_DISABLED]: { code: 6004, name: 'benefactorDisabled', message: 'Benefactor Disabled' },
    [STABLECOIN_ERROR__BENEFACTOR_ACTIVE]: { code: 6005, name: 'benefactorActive', message: 'Benefactor Active' },
    [STABLECOIN_ERROR__VAULT_NOT_ACTIVE]: { code: 6006, name: 'vaultNotActive', message: 'Vault Not Active' },
    [STABLECOIN_ERROR__INSUFFICIENT_AMOUNT]: { code: 6007, name: 'insufficientAmount', message: 'Insufficient Amount' },
    [STABLECOIN_ERROR__INVALID_FEE_RATE]: { code: 6008, name: 'invalidFeeRate', message: 'Invalid Fee Rate' },
    [STABLECOIN_ERROR__MINT_LIMIT_EXCEEDED]: { code: 6009, name: 'mintLimitExceeded', message: 'Mint Limit Exceeded' },
    [STABLECOIN_ERROR__REDEEM_LIMIT_EXCEEDED]: {
        code: 6010,
        name: 'redeemLimitExceeded',
        message: 'Redeem Limit Exceeded',
    },
    [STABLECOIN_ERROR__SLIPPAGE_TOLERANCE_EXCEEDED]: {
        code: 6011,
        name: 'slippageToleranceExceeded',
        message: 'Slippage Tolerance Exceeded',
    },
    [STABLECOIN_ERROR__MATH_OVERFLOW]: { code: 6012, name: 'mathOverflow', message: 'Math Overflow' },
    [STABLECOIN_ERROR__INVALID_L_P_MINT]: { code: 6013, name: 'invalidLPMint', message: 'Invalid LP Mint' },
    [STABLECOIN_ERROR__INVALID_VAULT_MINT]: { code: 6014, name: 'invalidVaultMint', message: 'Invalid Vault Mint' },
    [STABLECOIN_ERROR__INVALID_AUTHORITY]: { code: 6015, name: 'invalidAuthority', message: 'Invalid Authority' },
    [STABLECOIN_ERROR__INVALID_VAULT_TOKEN_ACCOUNT]: {
        code: 6016,
        name: 'invalidVaultTokenAccount',
        message: 'Invalid Vault Token Account',
    },
    [STABLECOIN_ERROR__INVALID_TOKEN_PROGRAM]: {
        code: 6017,
        name: 'invalidTokenProgram',
        message: 'Invalid Token Program',
    },
    [STABLECOIN_ERROR__INVALID_VAULT_FEE_TOKEN_ACCOUNT]: {
        code: 6018,
        name: 'invalidVaultFeeTokenAccount',
        message: 'Invalid Vault Fee Token Account',
    },
    [STABLECOIN_ERROR__BAD_ORACLE]: { code: 6019, name: 'badOracle', message: 'Bad Oracle' },
    [STABLECOIN_ERROR__NO_VALID_PRICE]: { code: 6020, name: 'noValidPrice', message: 'No Valid Price' },
    [STABLECOIN_ERROR__INVALID_BENEFACTOR]: { code: 6021, name: 'invalidBenefactor', message: 'Invalid Benefactor' },
    [STABLECOIN_ERROR__INVALID_CUSTODIAN]: { code: 6022, name: 'invalidCustodian', message: 'Invalid Custodian' },
    [STABLECOIN_ERROR__INVALID_PERIOD_LIMIT]: {
        code: 6023,
        name: 'invalidPeriodLimit',
        message: 'Invalid Rate Limit Window',
    },
    [STABLECOIN_ERROR__MISSING_ORACLE_ACCOUNTS]: {
        code: 6024,
        name: 'missingOracleAccounts',
        message: 'Missing Oracle Accounts',
    },
    [STABLECOIN_ERROR__NO_ORACLES_FOUND]: { code: 6025, name: 'noOraclesFound', message: 'No Oracles Found' },
    [STABLECOIN_ERROR__ZERO_AMOUNT]: { code: 6026, name: 'zeroAmount', message: 'Zero Amount' },
    [STABLECOIN_ERROR__PROTOCOL_PAUSED]: { code: 6027, name: 'protocolPaused', message: 'Protocol Paused' },
    [STABLECOIN_ERROR__OPERATOR_DISABLED]: { code: 6028, name: 'operatorDisabled', message: 'Operator Disabled' },
    [STABLECOIN_ERROR__VAULT_DISABLED]: { code: 6029, name: 'vaultDisabled', message: 'Vault Disabled' },
    [STABLECOIN_ERROR__VAULT_ENABLED]: { code: 6030, name: 'vaultEnabled', message: 'Vault Enabled' },
    [STABLECOIN_ERROR__VAULT_IS_DRY]: { code: 6031, name: 'vaultIsDry', message: 'Vault Is Dry' },
    [STABLECOIN_ERROR__INVALID_PEG_PRICE_U_S_D]: {
        code: 6032,
        name: 'invalidPegPriceUSD',
        message: 'Invalid Peg Price USD',
    },
    [STABLECOIN_ERROR__NO_VALID_ORACLE]: { code: 6033, name: 'noValidOracle', message: 'No Valid Oracle' },
    [STABLECOIN_ERROR__PRICE_CONFIDENCE_TOO_WIDE]: {
        code: 6034,
        name: 'priceConfidenceTooWide',
        message: 'Price Confidence Too Wide',
    },
    [STABLECOIN_ERROR__OPERATOR_CANNOT_DELETE_ITSELF]: {
        code: 6035,
        name: 'operatorCannotDeleteItself',
        message: 'Operator Cannot Delete Itself',
    },
};

export function getStablecoinErrorFromCode(code: number): StablecoinErrorInfo | undefined {
    return STABLECOIN_ERRORS[code as StablecoinError];
}

export function getStablecoinErrorMessage(code: StablecoinError): string {
    return STABLECOIN_ERRORS[code].message;
}
