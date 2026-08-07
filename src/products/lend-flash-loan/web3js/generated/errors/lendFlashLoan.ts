export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_AUTHORITY = 0x1770; // 6000
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_FEE_TOO_HIGH = 0x1771; // 6001
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_PARAMS = 0x1772; // 6002
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_ALREADY_ACTIVE = 0x1773; // 6003
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_ALREADY_INACTIVE = 0x1774; // 6004
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_CPI_TO_LIQUIDITY_FAILED = 0x1775; // 6005
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_NOT_ALLOWED_IN_THIS_SLOT = 0x1776; // 6006
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION_SYSVAR = 0x1777; // 6007
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION_DATA = 0x1778; // 6008
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_PAYBACK_NOT_FOUND = 0x1779; // 6009
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION = 0x177a; // 6010
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_PAUSED = 0x177b; // 6011
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_C_P_I_CALL_NOT_ALLOWED = 0x177c; // 6012
export const LEND_FLASH_LOAN_ERROR__FLASHLOAN_MULTIPLE_PAYBACKS_FOUND = 0x177d; // 6013

export type LendFlashLoanError =
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_ALREADY_ACTIVE
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_ALREADY_INACTIVE
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_C_P_I_CALL_NOT_ALLOWED
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_CPI_TO_LIQUIDITY_FAILED
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_FEE_TOO_HIGH
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_AUTHORITY
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION_DATA
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION_SYSVAR
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_PARAMS
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_MULTIPLE_PAYBACKS_FOUND
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_NOT_ALLOWED_IN_THIS_SLOT
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_PAUSED
    | typeof LEND_FLASH_LOAN_ERROR__FLASHLOAN_PAYBACK_NOT_FOUND;

export interface LendFlashLoanErrorInfo {
    code: LendFlashLoanError;
    name: string;
    message: string;
}

const LENDFLASHLOAN_ERRORS: Readonly<Record<LendFlashLoanError, LendFlashLoanErrorInfo>> = {
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_AUTHORITY]: {
        code: 6000,
        name: 'flashloanInvalidAuthority',
        message: 'FLASHLOAN_INVALID_AUTHORITY',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_FEE_TOO_HIGH]: {
        code: 6001,
        name: 'flashloanFeeTooHigh',
        message: 'FLASHLOAN_FEE_TOO_HIGH',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_PARAMS]: {
        code: 6002,
        name: 'flashloanInvalidParams',
        message: 'FLASHLOAN_INVALID_PARAMS',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_ALREADY_ACTIVE]: {
        code: 6003,
        name: 'flashloanAlreadyActive',
        message: 'FLASHLOAN_ALREADY_ACTIVE',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_ALREADY_INACTIVE]: {
        code: 6004,
        name: 'flashloanAlreadyInactive',
        message: 'FLASHLOAN_ALREADY_INACTIVE',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_CPI_TO_LIQUIDITY_FAILED]: {
        code: 6005,
        name: 'flashloanCpiToLiquidityFailed',
        message: 'FLASHLOAN_CPI_TO_LIQUIDITY_FAILED',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_NOT_ALLOWED_IN_THIS_SLOT]: {
        code: 6006,
        name: 'flashloanNotAllowedInThisSlot',
        message: 'FLASHLOAN_NOT_ALLOWED_IN_THIS_SLOT',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION_SYSVAR]: {
        code: 6007,
        name: 'flashloanInvalidInstructionSysvar',
        message: 'FLASHLOAN_INVALID_INSTRUCTION_SYSVAR',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION_DATA]: {
        code: 6008,
        name: 'flashloanInvalidInstructionData',
        message: 'FLASHLOAN_INVALID_INSTRUCTION_DATA',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_PAYBACK_NOT_FOUND]: {
        code: 6009,
        name: 'flashloanPaybackNotFound',
        message: 'FLASHLOAN_PAYBACK_NOT_FOUND',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_INVALID_INSTRUCTION]: {
        code: 6010,
        name: 'flashloanInvalidInstruction',
        message: 'FLASHLOAN_INVALID_INSTRUCTION',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_PAUSED]: { code: 6011, name: 'flashloanPaused', message: 'FLASHLOAN_PAUSED' },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_C_P_I_CALL_NOT_ALLOWED]: {
        code: 6012,
        name: 'flashloanCPICallNotAllowed',
        message: 'FLASHLOAN_CPICALL_NOT_ALLOWED',
    },
    [LEND_FLASH_LOAN_ERROR__FLASHLOAN_MULTIPLE_PAYBACKS_FOUND]: {
        code: 6013,
        name: 'flashloanMultiplePaybacksFound',
        message: 'FLASHLOAN_MULTIPLE_PAYBACKS_FOUND',
    },
};

export function getLendFlashLoanErrorFromCode(code: number): LendFlashLoanErrorInfo | undefined {
    return LENDFLASHLOAN_ERRORS[code as LendFlashLoanError];
}

export function getLendFlashLoanErrorMessage(code: LendFlashLoanError): string {
    return LENDFLASHLOAN_ERRORS[code].message;
}
