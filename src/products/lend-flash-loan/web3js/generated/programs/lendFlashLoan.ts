import {
    ACTIVATE_PROTOCOL_INSTRUCTION_DISCRIMINATOR,
    parseActivateProtocolInstruction,
    type ParsedActivateProtocolInstruction,
} from '../instructions/activateProtocol';
import { Address, TransactionInstruction } from '@solana/web3.js';
import { FLASHLOAN_ADMIN_ACCOUNT_DISCRIMINATOR } from '../accounts/flashloanAdmin';
import {
    FLASHLOAN_BORROW_INSTRUCTION_DISCRIMINATOR,
    parseFlashloanBorrowInstruction,
    type ParsedFlashloanBorrowInstruction,
} from '../instructions/flashloanBorrow';
import {
    FLASHLOAN_PAYBACK_INSTRUCTION_DISCRIMINATOR,
    parseFlashloanPaybackInstruction,
    type ParsedFlashloanPaybackInstruction,
} from '../instructions/flashloanPayback';
import {
    INIT_FLASHLOAN_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseInitFlashloanAdminInstruction,
    type ParsedInitFlashloanAdminInstruction,
} from '../instructions/initFlashloanAdmin';
import {
    PAUSE_PROTOCOL_INSTRUCTION_DISCRIMINATOR,
    parsePauseProtocolInstruction,
    type ParsedPauseProtocolInstruction,
} from '../instructions/pauseProtocol';
import {
    SET_FLASHLOAN_FEE_INSTRUCTION_DISCRIMINATOR,
    parseSetFlashloanFeeInstruction,
    type ParsedSetFlashloanFeeInstruction,
} from '../instructions/setFlashloanFee';
import {
    UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR,
    parseUpdateAuthorityInstruction,
    type ParsedUpdateAuthorityInstruction,
} from '../instructions/updateAuthority';

export const LENDFLASHLOAN_PROGRAM_ID = new Address('jupgfSgfuAXv4B6R2Uxu85Z1qdzgju79s6MfZekN6XS');
export const LEND_FLASH_LOAN_PROGRAM_ADDRESS = LENDFLASHLOAN_PROGRAM_ID;

export interface LendFlashLoanProgram {
    name: 'lendFlashLoan';
    programId: Address;
}

export function getLendFlashLoanProgram(programId: Address = LENDFLASHLOAN_PROGRAM_ID): LendFlashLoanProgram {
    return { name: 'lendFlashLoan', programId };
}

export enum LendFlashLoanAccount {
    FlashloanAdmin,
}

export function identifyLendFlashLoanAccount(account: { data: Uint8Array } | Uint8Array): LendFlashLoanAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (FLASHLOAN_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanAccount.FlashloanAdmin;
    throw new Error('Failed to identify LendFlashLoan account');
}

export enum LendFlashLoanInstruction {
    ActivateProtocol,
    FlashloanBorrow,
    FlashloanPayback,
    InitFlashloanAdmin,
    PauseProtocol,
    SetFlashloanFee,
    UpdateAuthority,
}

export function identifyLendFlashLoanInstruction(
    instruction: { data: Uint8Array } | Uint8Array,
): LendFlashLoanInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (ACTIVATE_PROTOCOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.ActivateProtocol;
    if (FLASHLOAN_BORROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.FlashloanBorrow;
    if (FLASHLOAN_PAYBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.FlashloanPayback;
    if (INIT_FLASHLOAN_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.InitFlashloanAdmin;
    if (PAUSE_PROTOCOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.PauseProtocol;
    if (SET_FLASHLOAN_FEE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.SetFlashloanFee;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendFlashLoanInstruction.UpdateAuthority;
    throw new Error('Failed to identify LendFlashLoan instruction');
}

export type ParsedLendFlashLoanInstruction =
    | ({ instructionType: LendFlashLoanInstruction.ActivateProtocol } & ParsedActivateProtocolInstruction)
    | ({ instructionType: LendFlashLoanInstruction.FlashloanBorrow } & ParsedFlashloanBorrowInstruction)
    | ({ instructionType: LendFlashLoanInstruction.FlashloanPayback } & ParsedFlashloanPaybackInstruction)
    | ({ instructionType: LendFlashLoanInstruction.InitFlashloanAdmin } & ParsedInitFlashloanAdminInstruction)
    | ({ instructionType: LendFlashLoanInstruction.PauseProtocol } & ParsedPauseProtocolInstruction)
    | ({ instructionType: LendFlashLoanInstruction.SetFlashloanFee } & ParsedSetFlashloanFeeInstruction)
    | ({ instructionType: LendFlashLoanInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction);

export function parseLendFlashLoanInstruction(instruction: TransactionInstruction): ParsedLendFlashLoanInstruction {
    const instructionType = identifyLendFlashLoanInstruction(instruction);
    switch (instructionType) {
        case LendFlashLoanInstruction.ActivateProtocol:
            return {
                instructionType,
                ...parseActivateProtocolInstruction(instruction),
            };
        case LendFlashLoanInstruction.FlashloanBorrow:
            return {
                instructionType,
                ...parseFlashloanBorrowInstruction(instruction),
            };
        case LendFlashLoanInstruction.FlashloanPayback:
            return {
                instructionType,
                ...parseFlashloanPaybackInstruction(instruction),
            };
        case LendFlashLoanInstruction.InitFlashloanAdmin:
            return {
                instructionType,
                ...parseInitFlashloanAdminInstruction(instruction),
            };
        case LendFlashLoanInstruction.PauseProtocol:
            return {
                instructionType,
                ...parsePauseProtocolInstruction(instruction),
            };
        case LendFlashLoanInstruction.SetFlashloanFee:
            return {
                instructionType,
                ...parseSetFlashloanFeeInstruction(instruction),
            };
        case LendFlashLoanInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
    }
}
