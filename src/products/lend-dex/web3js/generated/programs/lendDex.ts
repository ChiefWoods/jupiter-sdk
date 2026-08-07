import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    BORROW_INSTRUCTION_DISCRIMINATOR,
    parseBorrowInstruction,
    type ParsedBorrowInstruction,
} from '../instructions/borrow';
import {
    BORROW_PERFECT_INSTRUCTION_DISCRIMINATOR,
    parseBorrowPerfectInstruction,
    type ParsedBorrowPerfectInstruction,
} from '../instructions/borrowPerfect';
import {
    DEPOSIT_INSTRUCTION_DISCRIMINATOR,
    parseDepositInstruction,
    type ParsedDepositInstruction,
} from '../instructions/deposit';
import {
    DEPOSIT_PERFECT_INSTRUCTION_DISCRIMINATOR,
    parseDepositPerfectInstruction,
    type ParsedDepositPerfectInstruction,
} from '../instructions/depositPerfect';
import { DEX_ACCOUNT_DISCRIMINATOR } from '../accounts/dex';
import { DEX_ADMIN_ACCOUNT_DISCRIMINATOR } from '../accounts/dexAdmin';
import { DEX_METADATA_ACCOUNT_DISCRIMINATOR } from '../accounts/dexMetadata';
import { DEX_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/dexPosition';
import {
    INIT_DEX_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseInitDexAdminInstruction,
    type ParsedInitDexAdminInstruction,
} from '../instructions/initDexAdmin';
import {
    INIT_DEX_INSTRUCTION_DISCRIMINATOR,
    parseInitDexInstruction,
    type ParsedInitDexInstruction,
} from '../instructions/initDex';
import {
    INIT_DEX_METADATA_INSTRUCTION_DISCRIMINATOR,
    parseInitDexMetadataInstruction,
    type ParsedInitDexMetadataInstruction,
} from '../instructions/initDexMetadata';
import {
    INIT_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseInitPositionInstruction,
    type ParsedInitPositionInstruction,
} from '../instructions/initPosition';
import {
    PAUSE_DEX_INSTRUCTION_DISCRIMINATOR,
    parsePauseDexInstruction,
    type ParsedPauseDexInstruction,
} from '../instructions/pauseDex';
import {
    PAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR,
    parsePauseSwapAndArbitrageInstruction,
    type ParsedPauseSwapAndArbitrageInstruction,
} from '../instructions/pauseSwapAndArbitrage';
import {
    PAUSE_USER_INSTRUCTION_DISCRIMINATOR,
    parsePauseUserInstruction,
    type ParsedPauseUserInstruction,
} from '../instructions/pauseUser';
import {
    PAYBACK_INSTRUCTION_DISCRIMINATOR,
    parsePaybackInstruction,
    type ParsedPaybackInstruction,
} from '../instructions/payback';
import {
    PAYBACK_PERFECT_INSTRUCTION_DISCRIMINATOR,
    parsePaybackPerfectInstruction,
    type ParsedPaybackPerfectInstruction,
} from '../instructions/paybackPerfect';
import {
    PAYBACK_PERFECT_IN_ONE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parsePaybackPerfectInOneTokenInstruction,
    type ParsedPaybackPerfectInOneTokenInstruction,
} from '../instructions/paybackPerfectInOneToken';
import {
    PREVIEW_DEX_SHARES_INSTRUCTION_DISCRIMINATOR,
    parsePreviewDexSharesInstruction,
    type ParsedPreviewDexSharesInstruction,
} from '../instructions/previewDexShares';
import {
    SWAP_IN_INSTRUCTION_DISCRIMINATOR,
    parseSwapInInstruction,
    type ParsedSwapInInstruction,
} from '../instructions/swapIn';
import {
    SWAP_OUT_INSTRUCTION_DISCRIMINATOR,
    parseSwapOutInstruction,
    type ParsedSwapOutInstruction,
} from '../instructions/swapOut';
import { TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR } from '../accounts/tokenReserve';
import {
    TURN_ON_SMART_COL_INSTRUCTION_DISCRIMINATOR,
    parseTurnOnSmartColInstruction,
    type ParsedTurnOnSmartColInstruction,
} from '../instructions/turnOnSmartCol';
import {
    TURN_ON_SMART_DEBT_INSTRUCTION_DISCRIMINATOR,
    parseTurnOnSmartDebtInstruction,
    type ParsedTurnOnSmartDebtInstruction,
} from '../instructions/turnOnSmartDebt';
import {
    UNPAUSE_DEX_INSTRUCTION_DISCRIMINATOR,
    parseUnpauseDexInstruction,
    type ParsedUnpauseDexInstruction,
} from '../instructions/unpauseDex';
import {
    UNPAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR,
    parseUnpauseSwapAndArbitrageInstruction,
    type ParsedUnpauseSwapAndArbitrageInstruction,
} from '../instructions/unpauseSwapAndArbitrage';
import {
    UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR,
    parseUnpauseUserInstruction,
    type ParsedUnpauseUserInstruction,
} from '../instructions/unpauseUser';
import {
    UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR,
    parseUpdateAuthorityInstruction,
    type ParsedUpdateAuthorityInstruction,
} from '../instructions/updateAuthority';
import {
    UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateAuthsInstruction,
    type ParsedUpdateAuthsInstruction,
} from '../instructions/updateAuths';
import {
    UPDATE_CENTER_PRICE_ADDRESS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateCenterPriceAddressInstruction,
    type ParsedUpdateCenterPriceAddressInstruction,
} from '../instructions/updateCenterPriceAddress';
import {
    UPDATE_CENTER_PRICE_LIMITS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateCenterPriceLimitsInstruction,
    type ParsedUpdateCenterPriceLimitsInstruction,
} from '../instructions/updateCenterPriceLimits';
import {
    UPDATE_DEX_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR,
    parseUpdateDexLookupTableInstruction,
    type ParsedUpdateDexLookupTableInstruction,
} from '../instructions/updateDexLookupTable';
import {
    UPDATE_FEE_AND_REVENUE_CUT_INSTRUCTION_DISCRIMINATOR,
    parseUpdateFeeAndRevenueCutInstruction,
    type ParsedUpdateFeeAndRevenueCutInstruction,
} from '../instructions/updateFeeAndRevenueCut';
import {
    UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateGuardiansInstruction,
    type ParsedUpdateGuardiansInstruction,
} from '../instructions/updateGuardians';
import {
    UPDATE_MAX_BORROW_SHARES_INSTRUCTION_DISCRIMINATOR,
    parseUpdateMaxBorrowSharesInstruction,
    type ParsedUpdateMaxBorrowSharesInstruction,
} from '../instructions/updateMaxBorrowShares';
import {
    UPDATE_MAX_SUPPLY_SHARES_INSTRUCTION_DISCRIMINATOR,
    parseUpdateMaxSupplySharesInstruction,
    type ParsedUpdateMaxSupplySharesInstruction,
} from '../instructions/updateMaxSupplyShares';
import {
    UPDATE_RANGE_PERCENTS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRangePercentsInstruction,
    type ParsedUpdateRangePercentsInstruction,
} from '../instructions/updateRangePercents';
import {
    UPDATE_THRESHOLD_PERCENT_INSTRUCTION_DISCRIMINATOR,
    parseUpdateThresholdPercentInstruction,
    type ParsedUpdateThresholdPercentInstruction,
} from '../instructions/updateThresholdPercent';
import {
    UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseUpdateUserBorrowConfigInstruction,
    type ParsedUpdateUserBorrowConfigInstruction,
} from '../instructions/updateUserBorrowConfig';
import {
    UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseUpdateUserSupplyConfigInstruction,
    type ParsedUpdateUserSupplyConfigInstruction,
} from '../instructions/updateUserSupplyConfig';
import {
    UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR,
    parseUpdateUserWithdrawalLimitInstruction,
    type ParsedUpdateUserWithdrawalLimitInstruction,
} from '../instructions/updateUserWithdrawalLimit';
import {
    UPDATE_UTILIZATION_LIMIT_INSTRUCTION_DISCRIMINATOR,
    parseUpdateUtilizationLimitInstruction,
    type ParsedUpdateUtilizationLimitInstruction,
} from '../instructions/updateUtilizationLimit';
import { USER_BORROW_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userBorrowPosition';
import { USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userSupplyPosition';
import {
    WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawInstruction,
    type ParsedWithdrawInstruction,
} from '../instructions/withdraw';
import {
    WITHDRAW_PERFECT_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawPerfectInstruction,
    type ParsedWithdrawPerfectInstruction,
} from '../instructions/withdrawPerfect';
import {
    WITHDRAW_PERFECT_IN_ONE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawPerfectInOneTokenInstruction,
    type ParsedWithdrawPerfectInOneTokenInstruction,
} from '../instructions/withdrawPerfectInOneToken';

export const LENDDEX_PROGRAM_ID = new Address('jupZ4m2GqUCJ5iueMfzQf8khFfH31d4XAQt3RzCT9Vd');
export const LEND_DEX_PROGRAM_ADDRESS = LENDDEX_PROGRAM_ID;

export interface LendDexProgram {
    name: 'lendDex';
    programId: Address;
}

export function getLendDexProgram(programId: Address = LENDDEX_PROGRAM_ID): LendDexProgram {
    return { name: 'lendDex', programId };
}

export enum LendDexAccount {
    Dex,
    DexAdmin,
    DexMetadata,
    DexPosition,
    TokenReserve,
    UserBorrowPosition,
    UserSupplyPosition,
}

export function identifyLendDexAccount(account: { data: Uint8Array } | Uint8Array): LendDexAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (DEX_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendDexAccount.Dex;
    if (DEX_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexAccount.DexAdmin;
    if (DEX_METADATA_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexAccount.DexMetadata;
    if (DEX_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexAccount.DexPosition;
    if (TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexAccount.TokenReserve;
    if (USER_BORROW_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexAccount.UserBorrowPosition;
    if (USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexAccount.UserSupplyPosition;
    throw new Error('Failed to identify LendDex account');
}

export enum LendDexInstruction {
    Borrow,
    BorrowPerfect,
    Deposit,
    DepositPerfect,
    InitDex,
    InitDexAdmin,
    InitDexMetadata,
    InitPosition,
    PauseDex,
    PauseSwapAndArbitrage,
    PauseUser,
    Payback,
    PaybackPerfect,
    PaybackPerfectInOneToken,
    PreviewDexShares,
    SwapIn,
    SwapOut,
    TurnOnSmartCol,
    TurnOnSmartDebt,
    UnpauseDex,
    UnpauseSwapAndArbitrage,
    UnpauseUser,
    UpdateAuthority,
    UpdateAuths,
    UpdateCenterPriceAddress,
    UpdateCenterPriceLimits,
    UpdateDexLookupTable,
    UpdateFeeAndRevenueCut,
    UpdateGuardians,
    UpdateMaxBorrowShares,
    UpdateMaxSupplyShares,
    UpdateRangePercents,
    UpdateThresholdPercent,
    UpdateUserBorrowConfig,
    UpdateUserSupplyConfig,
    UpdateUserWithdrawalLimit,
    UpdateUtilizationLimit,
    Withdraw,
    WithdrawPerfect,
    WithdrawPerfectInOneToken,
}

export function identifyLendDexInstruction(instruction: { data: Uint8Array } | Uint8Array): LendDexInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (BORROW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.Borrow;
    if (BORROW_PERFECT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.BorrowPerfect;
    if (DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.Deposit;
    if (DEPOSIT_PERFECT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.DepositPerfect;
    if (INIT_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.InitDex;
    if (INIT_DEX_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.InitDexAdmin;
    if (INIT_DEX_METADATA_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.InitDexMetadata;
    if (INIT_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.InitPosition;
    if (PAUSE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.PauseDex;
    if (PAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.PauseSwapAndArbitrage;
    if (PAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.PauseUser;
    if (PAYBACK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.Payback;
    if (PAYBACK_PERFECT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.PaybackPerfect;
    if (PAYBACK_PERFECT_IN_ONE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.PaybackPerfectInOneToken;
    if (PREVIEW_DEX_SHARES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.PreviewDexShares;
    if (SWAP_IN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.SwapIn;
    if (SWAP_OUT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.SwapOut;
    if (TURN_ON_SMART_COL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.TurnOnSmartCol;
    if (TURN_ON_SMART_DEBT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.TurnOnSmartDebt;
    if (UNPAUSE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UnpauseDex;
    if (UNPAUSE_SWAP_AND_ARBITRAGE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UnpauseSwapAndArbitrage;
    if (UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UnpauseUser;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateAuthority;
    if (UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateAuths;
    if (UPDATE_CENTER_PRICE_ADDRESS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateCenterPriceAddress;
    if (UPDATE_CENTER_PRICE_LIMITS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateCenterPriceLimits;
    if (UPDATE_DEX_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateDexLookupTable;
    if (UPDATE_FEE_AND_REVENUE_CUT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateFeeAndRevenueCut;
    if (UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateGuardians;
    if (UPDATE_MAX_BORROW_SHARES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateMaxBorrowShares;
    if (UPDATE_MAX_SUPPLY_SHARES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateMaxSupplyShares;
    if (UPDATE_RANGE_PERCENTS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateRangePercents;
    if (UPDATE_THRESHOLD_PERCENT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateThresholdPercent;
    if (UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateUserBorrowConfig;
    if (UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateUserSupplyConfig;
    if (UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateUserWithdrawalLimit;
    if (UPDATE_UTILIZATION_LIMIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.UpdateUtilizationLimit;
    if (WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.Withdraw;
    if (WITHDRAW_PERFECT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.WithdrawPerfect;
    if (WITHDRAW_PERFECT_IN_ONE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendDexInstruction.WithdrawPerfectInOneToken;
    throw new Error('Failed to identify LendDex instruction');
}

export type ParsedLendDexInstruction =
    | ({ instructionType: LendDexInstruction.Borrow } & ParsedBorrowInstruction)
    | ({ instructionType: LendDexInstruction.BorrowPerfect } & ParsedBorrowPerfectInstruction)
    | ({ instructionType: LendDexInstruction.Deposit } & ParsedDepositInstruction)
    | ({ instructionType: LendDexInstruction.DepositPerfect } & ParsedDepositPerfectInstruction)
    | ({ instructionType: LendDexInstruction.InitDex } & ParsedInitDexInstruction)
    | ({ instructionType: LendDexInstruction.InitDexAdmin } & ParsedInitDexAdminInstruction)
    | ({ instructionType: LendDexInstruction.InitDexMetadata } & ParsedInitDexMetadataInstruction)
    | ({ instructionType: LendDexInstruction.InitPosition } & ParsedInitPositionInstruction)
    | ({ instructionType: LendDexInstruction.PauseDex } & ParsedPauseDexInstruction)
    | ({ instructionType: LendDexInstruction.PauseSwapAndArbitrage } & ParsedPauseSwapAndArbitrageInstruction)
    | ({ instructionType: LendDexInstruction.PauseUser } & ParsedPauseUserInstruction)
    | ({ instructionType: LendDexInstruction.Payback } & ParsedPaybackInstruction)
    | ({ instructionType: LendDexInstruction.PaybackPerfect } & ParsedPaybackPerfectInstruction)
    | ({ instructionType: LendDexInstruction.PaybackPerfectInOneToken } & ParsedPaybackPerfectInOneTokenInstruction)
    | ({ instructionType: LendDexInstruction.PreviewDexShares } & ParsedPreviewDexSharesInstruction)
    | ({ instructionType: LendDexInstruction.SwapIn } & ParsedSwapInInstruction)
    | ({ instructionType: LendDexInstruction.SwapOut } & ParsedSwapOutInstruction)
    | ({ instructionType: LendDexInstruction.TurnOnSmartCol } & ParsedTurnOnSmartColInstruction)
    | ({ instructionType: LendDexInstruction.TurnOnSmartDebt } & ParsedTurnOnSmartDebtInstruction)
    | ({ instructionType: LendDexInstruction.UnpauseDex } & ParsedUnpauseDexInstruction)
    | ({ instructionType: LendDexInstruction.UnpauseSwapAndArbitrage } & ParsedUnpauseSwapAndArbitrageInstruction)
    | ({ instructionType: LendDexInstruction.UnpauseUser } & ParsedUnpauseUserInstruction)
    | ({ instructionType: LendDexInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction)
    | ({ instructionType: LendDexInstruction.UpdateAuths } & ParsedUpdateAuthsInstruction)
    | ({ instructionType: LendDexInstruction.UpdateCenterPriceAddress } & ParsedUpdateCenterPriceAddressInstruction)
    | ({ instructionType: LendDexInstruction.UpdateCenterPriceLimits } & ParsedUpdateCenterPriceLimitsInstruction)
    | ({ instructionType: LendDexInstruction.UpdateDexLookupTable } & ParsedUpdateDexLookupTableInstruction)
    | ({ instructionType: LendDexInstruction.UpdateFeeAndRevenueCut } & ParsedUpdateFeeAndRevenueCutInstruction)
    | ({ instructionType: LendDexInstruction.UpdateGuardians } & ParsedUpdateGuardiansInstruction)
    | ({ instructionType: LendDexInstruction.UpdateMaxBorrowShares } & ParsedUpdateMaxBorrowSharesInstruction)
    | ({ instructionType: LendDexInstruction.UpdateMaxSupplyShares } & ParsedUpdateMaxSupplySharesInstruction)
    | ({ instructionType: LendDexInstruction.UpdateRangePercents } & ParsedUpdateRangePercentsInstruction)
    | ({ instructionType: LendDexInstruction.UpdateThresholdPercent } & ParsedUpdateThresholdPercentInstruction)
    | ({ instructionType: LendDexInstruction.UpdateUserBorrowConfig } & ParsedUpdateUserBorrowConfigInstruction)
    | ({ instructionType: LendDexInstruction.UpdateUserSupplyConfig } & ParsedUpdateUserSupplyConfigInstruction)
    | ({ instructionType: LendDexInstruction.UpdateUserWithdrawalLimit } & ParsedUpdateUserWithdrawalLimitInstruction)
    | ({ instructionType: LendDexInstruction.UpdateUtilizationLimit } & ParsedUpdateUtilizationLimitInstruction)
    | ({ instructionType: LendDexInstruction.Withdraw } & ParsedWithdrawInstruction)
    | ({ instructionType: LendDexInstruction.WithdrawPerfect } & ParsedWithdrawPerfectInstruction)
    | ({ instructionType: LendDexInstruction.WithdrawPerfectInOneToken } & ParsedWithdrawPerfectInOneTokenInstruction);

export function parseLendDexInstruction(instruction: TransactionInstruction): ParsedLendDexInstruction {
    const instructionType = identifyLendDexInstruction(instruction);
    switch (instructionType) {
        case LendDexInstruction.Borrow:
            return {
                instructionType,
                ...parseBorrowInstruction(instruction),
            };
        case LendDexInstruction.BorrowPerfect:
            return {
                instructionType,
                ...parseBorrowPerfectInstruction(instruction),
            };
        case LendDexInstruction.Deposit:
            return {
                instructionType,
                ...parseDepositInstruction(instruction),
            };
        case LendDexInstruction.DepositPerfect:
            return {
                instructionType,
                ...parseDepositPerfectInstruction(instruction),
            };
        case LendDexInstruction.InitDex:
            return {
                instructionType,
                ...parseInitDexInstruction(instruction),
            };
        case LendDexInstruction.InitDexAdmin:
            return {
                instructionType,
                ...parseInitDexAdminInstruction(instruction),
            };
        case LendDexInstruction.InitDexMetadata:
            return {
                instructionType,
                ...parseInitDexMetadataInstruction(instruction),
            };
        case LendDexInstruction.InitPosition:
            return {
                instructionType,
                ...parseInitPositionInstruction(instruction),
            };
        case LendDexInstruction.PauseDex:
            return {
                instructionType,
                ...parsePauseDexInstruction(instruction),
            };
        case LendDexInstruction.PauseSwapAndArbitrage:
            return {
                instructionType,
                ...parsePauseSwapAndArbitrageInstruction(instruction),
            };
        case LendDexInstruction.PauseUser:
            return {
                instructionType,
                ...parsePauseUserInstruction(instruction),
            };
        case LendDexInstruction.Payback:
            return {
                instructionType,
                ...parsePaybackInstruction(instruction),
            };
        case LendDexInstruction.PaybackPerfect:
            return {
                instructionType,
                ...parsePaybackPerfectInstruction(instruction),
            };
        case LendDexInstruction.PaybackPerfectInOneToken:
            return {
                instructionType,
                ...parsePaybackPerfectInOneTokenInstruction(instruction),
            };
        case LendDexInstruction.PreviewDexShares:
            return {
                instructionType,
                ...parsePreviewDexSharesInstruction(instruction),
            };
        case LendDexInstruction.SwapIn:
            return {
                instructionType,
                ...parseSwapInInstruction(instruction),
            };
        case LendDexInstruction.SwapOut:
            return {
                instructionType,
                ...parseSwapOutInstruction(instruction),
            };
        case LendDexInstruction.TurnOnSmartCol:
            return {
                instructionType,
                ...parseTurnOnSmartColInstruction(instruction),
            };
        case LendDexInstruction.TurnOnSmartDebt:
            return {
                instructionType,
                ...parseTurnOnSmartDebtInstruction(instruction),
            };
        case LendDexInstruction.UnpauseDex:
            return {
                instructionType,
                ...parseUnpauseDexInstruction(instruction),
            };
        case LendDexInstruction.UnpauseSwapAndArbitrage:
            return {
                instructionType,
                ...parseUnpauseSwapAndArbitrageInstruction(instruction),
            };
        case LendDexInstruction.UnpauseUser:
            return {
                instructionType,
                ...parseUnpauseUserInstruction(instruction),
            };
        case LendDexInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
        case LendDexInstruction.UpdateAuths:
            return {
                instructionType,
                ...parseUpdateAuthsInstruction(instruction),
            };
        case LendDexInstruction.UpdateCenterPriceAddress:
            return {
                instructionType,
                ...parseUpdateCenterPriceAddressInstruction(instruction),
            };
        case LendDexInstruction.UpdateCenterPriceLimits:
            return {
                instructionType,
                ...parseUpdateCenterPriceLimitsInstruction(instruction),
            };
        case LendDexInstruction.UpdateDexLookupTable:
            return {
                instructionType,
                ...parseUpdateDexLookupTableInstruction(instruction),
            };
        case LendDexInstruction.UpdateFeeAndRevenueCut:
            return {
                instructionType,
                ...parseUpdateFeeAndRevenueCutInstruction(instruction),
            };
        case LendDexInstruction.UpdateGuardians:
            return {
                instructionType,
                ...parseUpdateGuardiansInstruction(instruction),
            };
        case LendDexInstruction.UpdateMaxBorrowShares:
            return {
                instructionType,
                ...parseUpdateMaxBorrowSharesInstruction(instruction),
            };
        case LendDexInstruction.UpdateMaxSupplyShares:
            return {
                instructionType,
                ...parseUpdateMaxSupplySharesInstruction(instruction),
            };
        case LendDexInstruction.UpdateRangePercents:
            return {
                instructionType,
                ...parseUpdateRangePercentsInstruction(instruction),
            };
        case LendDexInstruction.UpdateThresholdPercent:
            return {
                instructionType,
                ...parseUpdateThresholdPercentInstruction(instruction),
            };
        case LendDexInstruction.UpdateUserBorrowConfig:
            return {
                instructionType,
                ...parseUpdateUserBorrowConfigInstruction(instruction),
            };
        case LendDexInstruction.UpdateUserSupplyConfig:
            return {
                instructionType,
                ...parseUpdateUserSupplyConfigInstruction(instruction),
            };
        case LendDexInstruction.UpdateUserWithdrawalLimit:
            return {
                instructionType,
                ...parseUpdateUserWithdrawalLimitInstruction(instruction),
            };
        case LendDexInstruction.UpdateUtilizationLimit:
            return {
                instructionType,
                ...parseUpdateUtilizationLimitInstruction(instruction),
            };
        case LendDexInstruction.Withdraw:
            return {
                instructionType,
                ...parseWithdrawInstruction(instruction),
            };
        case LendDexInstruction.WithdrawPerfect:
            return {
                instructionType,
                ...parseWithdrawPerfectInstruction(instruction),
            };
        case LendDexInstruction.WithdrawPerfectInOneToken:
            return {
                instructionType,
                ...parseWithdrawPerfectInOneTokenInstruction(instruction),
            };
    }
}
