export const INVITE_ESCROW_ERROR__MATH_OVERFLOW = 0x1770; // 6000
export const INVITE_ESCROW_ERROR__AMOUNT_BELOW_MINIMUM_LAMPORTS = 0x1771; // 6001
export const INVITE_ESCROW_ERROR__NOT_YET_EXPIRED = 0x1772; // 6002
export const INVITE_ESCROW_ERROR__EXPIRED = 0x1773; // 6003
export const INVITE_ESCROW_ERROR__ZERO_AMOUNT = 0x1774; // 6004

export type InviteEscrowError =
    | typeof INVITE_ESCROW_ERROR__AMOUNT_BELOW_MINIMUM_LAMPORTS
    | typeof INVITE_ESCROW_ERROR__EXPIRED
    | typeof INVITE_ESCROW_ERROR__MATH_OVERFLOW
    | typeof INVITE_ESCROW_ERROR__NOT_YET_EXPIRED
    | typeof INVITE_ESCROW_ERROR__ZERO_AMOUNT;

export interface InviteEscrowErrorInfo {
    code: InviteEscrowError;
    name: string;
    message: string;
}

const INVITEESCROW_ERRORS: Readonly<Record<InviteEscrowError, InviteEscrowErrorInfo>> = {
    [INVITE_ESCROW_ERROR__MATH_OVERFLOW]: { code: 6000, name: 'mathOverflow', message: '' },
    [INVITE_ESCROW_ERROR__AMOUNT_BELOW_MINIMUM_LAMPORTS]: {
        code: 6001,
        name: 'amountBelowMinimumLamports',
        message: '',
    },
    [INVITE_ESCROW_ERROR__NOT_YET_EXPIRED]: { code: 6002, name: 'notYetExpired', message: '' },
    [INVITE_ESCROW_ERROR__EXPIRED]: { code: 6003, name: 'expired', message: '' },
    [INVITE_ESCROW_ERROR__ZERO_AMOUNT]: { code: 6004, name: 'zeroAmount', message: '' },
};

export function getInviteEscrowErrorFromCode(code: number): InviteEscrowErrorInfo | undefined {
    return INVITEESCROW_ERRORS[code as InviteEscrowError];
}

export function getInviteEscrowErrorMessage(code: InviteEscrowError): string {
    return INVITEESCROW_ERRORS[code].message;
}
