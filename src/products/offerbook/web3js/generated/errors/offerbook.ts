export const OFFERBOOK_ERROR__DUPLICATE_RESOURCES = 0x1770; // 6000
export const OFFERBOOK_ERROR__ADMIN_ARRAY_FULL = 0x1771; // 6001
export const OFFERBOOK_ERROR__NEW_ADMIN_IS_OLD_ADMIN = 0x1772; // 6002
export const OFFERBOOK_ERROR__NOT_AUTHORIZED = 0x1773; // 6003
export const OFFERBOOK_ERROR__BAD_INPUT = 0x1774; // 6004
export const OFFERBOOK_ERROR__PROTOCOL_PAUSED = 0x1775; // 6005
export const OFFERBOOK_ERROR__ALREADY_PAUSED = 0x1776; // 6006
export const OFFERBOOK_ERROR__ALREADY_UNPAUSED = 0x1777; // 6007
export const OFFERBOOK_ERROR__INVALID_REFERRER = 0x1778; // 6008
export const OFFERBOOK_ERROR__INVALID_TOKEN_MINT = 0x1779; // 6009
export const OFFERBOOK_ERROR__INVALID_DURATION = 0x177a; // 6010
export const OFFERBOOK_ERROR__INVALID_EXPIRY = 0x177b; // 6011
export const OFFERBOOK_ERROR__INVALID_A_P_Y = 0x177c; // 6012
export const OFFERBOOK_ERROR__INVALID_OWNER = 0x177d; // 6013
export const OFFERBOOK_ERROR__INVALID_OFFER_STATUS = 0x177e; // 6014
export const OFFERBOOK_ERROR__INVALID_OFFER_ORIGIN = 0x177f; // 6015
export const OFFERBOOK_ERROR__INVALID_COLLATERAL = 0x1780; // 6016
export const OFFERBOOK_ERROR__OFFER_EXPIRED = 0x1781; // 6017
export const OFFERBOOK_ERROR__INVALID_FILL_AMOUNT = 0x1782; // 6018
export const OFFERBOOK_ERROR__INVALID_LOAN_STATUS = 0x1783; // 6019
export const OFFERBOOK_ERROR__LOAN_NOT_DUE = 0x1784; // 6020
export const OFFERBOOK_ERROR__INVALID_OFFER_SIDE = 0x1785; // 6021
export const OFFERBOOK_ERROR__INVALID_ASSET = 0x1786; // 6022
export const OFFERBOOK_ERROR__MISSING_LOAN_VAULT = 0x1787; // 6023

export type OfferbookError =
    | typeof OFFERBOOK_ERROR__ADMIN_ARRAY_FULL
    | typeof OFFERBOOK_ERROR__ALREADY_PAUSED
    | typeof OFFERBOOK_ERROR__ALREADY_UNPAUSED
    | typeof OFFERBOOK_ERROR__BAD_INPUT
    | typeof OFFERBOOK_ERROR__DUPLICATE_RESOURCES
    | typeof OFFERBOOK_ERROR__INVALID_A_P_Y
    | typeof OFFERBOOK_ERROR__INVALID_ASSET
    | typeof OFFERBOOK_ERROR__INVALID_COLLATERAL
    | typeof OFFERBOOK_ERROR__INVALID_DURATION
    | typeof OFFERBOOK_ERROR__INVALID_EXPIRY
    | typeof OFFERBOOK_ERROR__INVALID_FILL_AMOUNT
    | typeof OFFERBOOK_ERROR__INVALID_LOAN_STATUS
    | typeof OFFERBOOK_ERROR__INVALID_OFFER_ORIGIN
    | typeof OFFERBOOK_ERROR__INVALID_OFFER_SIDE
    | typeof OFFERBOOK_ERROR__INVALID_OFFER_STATUS
    | typeof OFFERBOOK_ERROR__INVALID_OWNER
    | typeof OFFERBOOK_ERROR__INVALID_REFERRER
    | typeof OFFERBOOK_ERROR__INVALID_TOKEN_MINT
    | typeof OFFERBOOK_ERROR__LOAN_NOT_DUE
    | typeof OFFERBOOK_ERROR__MISSING_LOAN_VAULT
    | typeof OFFERBOOK_ERROR__NEW_ADMIN_IS_OLD_ADMIN
    | typeof OFFERBOOK_ERROR__NOT_AUTHORIZED
    | typeof OFFERBOOK_ERROR__OFFER_EXPIRED
    | typeof OFFERBOOK_ERROR__PROTOCOL_PAUSED;

export interface OfferbookErrorInfo {
    code: OfferbookError;
    name: string;
    message: string;
}

const OFFERBOOK_ERRORS: Readonly<Record<OfferbookError, OfferbookErrorInfo>> = {
    [OFFERBOOK_ERROR__DUPLICATE_RESOURCES]: { code: 6000, name: 'duplicateResources', message: 'Duplicate Resources' },
    [OFFERBOOK_ERROR__ADMIN_ARRAY_FULL]: { code: 6001, name: 'adminArrayFull', message: 'Admin Array Full' },
    [OFFERBOOK_ERROR__NEW_ADMIN_IS_OLD_ADMIN]: {
        code: 6002,
        name: 'newAdminIsOldAdmin',
        message: 'New Admin Is Old Admin',
    },
    [OFFERBOOK_ERROR__NOT_AUTHORIZED]: { code: 6003, name: 'notAuthorized', message: 'Not Authorized' },
    [OFFERBOOK_ERROR__BAD_INPUT]: { code: 6004, name: 'badInput', message: 'Bad Input' },
    [OFFERBOOK_ERROR__PROTOCOL_PAUSED]: { code: 6005, name: 'protocolPaused', message: 'Protocol Paused' },
    [OFFERBOOK_ERROR__ALREADY_PAUSED]: { code: 6006, name: 'alreadyPaused', message: 'Already Paused' },
    [OFFERBOOK_ERROR__ALREADY_UNPAUSED]: { code: 6007, name: 'alreadyUnpaused', message: 'Already Unpaused' },
    [OFFERBOOK_ERROR__INVALID_REFERRER]: { code: 6008, name: 'invalidReferrer', message: 'Invalid Referrer' },
    [OFFERBOOK_ERROR__INVALID_TOKEN_MINT]: { code: 6009, name: 'invalidTokenMint', message: 'Invalid Token Mint' },
    [OFFERBOOK_ERROR__INVALID_DURATION]: { code: 6010, name: 'invalidDuration', message: 'Invalid Duration' },
    [OFFERBOOK_ERROR__INVALID_EXPIRY]: { code: 6011, name: 'invalidExpiry', message: 'Invalid Expiry' },
    [OFFERBOOK_ERROR__INVALID_A_P_Y]: { code: 6012, name: 'invalidAPY', message: 'Invalid APY' },
    [OFFERBOOK_ERROR__INVALID_OWNER]: { code: 6013, name: 'invalidOwner', message: 'Invalid Owner' },
    [OFFERBOOK_ERROR__INVALID_OFFER_STATUS]: {
        code: 6014,
        name: 'invalidOfferStatus',
        message: 'Invalid Offer Status',
    },
    [OFFERBOOK_ERROR__INVALID_OFFER_ORIGIN]: {
        code: 6015,
        name: 'invalidOfferOrigin',
        message: 'Invalid Offer Origin',
    },
    [OFFERBOOK_ERROR__INVALID_COLLATERAL]: { code: 6016, name: 'invalidCollateral', message: 'Invalid Collateral' },
    [OFFERBOOK_ERROR__OFFER_EXPIRED]: { code: 6017, name: 'offerExpired', message: 'Offer Expired' },
    [OFFERBOOK_ERROR__INVALID_FILL_AMOUNT]: { code: 6018, name: 'invalidFillAmount', message: 'Invalid Fill Amount' },
    [OFFERBOOK_ERROR__INVALID_LOAN_STATUS]: { code: 6019, name: 'invalidLoanStatus', message: 'Invalid Loan Status' },
    [OFFERBOOK_ERROR__LOAN_NOT_DUE]: { code: 6020, name: 'loanNotDue', message: 'Loan is not due' },
    [OFFERBOOK_ERROR__INVALID_OFFER_SIDE]: { code: 6021, name: 'invalidOfferSide', message: 'Invalid Offer Side' },
    [OFFERBOOK_ERROR__INVALID_ASSET]: { code: 6022, name: 'invalidAsset', message: 'Invalid Asset' },
    [OFFERBOOK_ERROR__MISSING_LOAN_VAULT]: { code: 6023, name: 'missingLoanVault', message: 'Missing Loan Vault' },
};

export function getOfferbookErrorFromCode(code: number): OfferbookErrorInfo | undefined {
    return OFFERBOOK_ERRORS[code as OfferbookError];
}

export function getOfferbookErrorMessage(code: OfferbookError): string {
    return OFFERBOOK_ERRORS[code].message;
}
