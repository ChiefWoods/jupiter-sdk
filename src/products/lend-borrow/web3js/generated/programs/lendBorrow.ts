import { Address, TransactionInstruction } from '@solana/web3.js';
import { BRANCH_ACCOUNT_DISCRIMINATOR } from '../accounts/branch';
import { DEX_ACCOUNT_DISCRIMINATOR } from '../accounts/dex';
import { DEX_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/dexPosition';
import {
    GET_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR,
    parseGetExchangePricesInstruction,
    type ParsedGetExchangePricesInstruction,
} from '../instructions/getExchangePrices';
import {
    INIT_BRANCH_INSTRUCTION_DISCRIMINATOR,
    parseInitBranchInstruction,
    type ParsedInitBranchInstruction,
} from '../instructions/initBranch';
import {
    INIT_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseInitPositionInstruction,
    type ParsedInitPositionInstruction,
} from '../instructions/initPosition';
import {
    INIT_TICK_HAS_DEBT_ARRAY_INSTRUCTION_DISCRIMINATOR,
    parseInitTickHasDebtArrayInstruction,
    type ParsedInitTickHasDebtArrayInstruction,
} from '../instructions/initTickHasDebtArray';
import {
    INIT_TICK_ID_LIQUIDATION_INSTRUCTION_DISCRIMINATOR,
    parseInitTickIdLiquidationInstruction,
    type ParsedInitTickIdLiquidationInstruction,
} from '../instructions/initTickIdLiquidation';
import {
    INIT_TICK_INSTRUCTION_DISCRIMINATOR,
    parseInitTickInstruction,
    type ParsedInitTickInstruction,
} from '../instructions/initTick';
import {
    INIT_VAULT_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseInitVaultAdminInstruction,
    type ParsedInitVaultAdminInstruction,
} from '../instructions/initVaultAdmin';
import {
    INIT_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseInitVaultConfigInstruction,
    type ParsedInitVaultConfigInstruction,
} from '../instructions/initVaultConfig';
import {
    INIT_VAULT_STATE_INSTRUCTION_DISCRIMINATOR,
    parseInitVaultStateInstruction,
    type ParsedInitVaultStateInstruction,
} from '../instructions/initVaultState';
import {
    LIQUIDATE_DEX_INSTRUCTION_DISCRIMINATOR,
    parseLiquidateDexInstruction,
    type ParsedLiquidateDexInstruction,
} from '../instructions/liquidateDex';
import {
    LIQUIDATE_INSTRUCTION_DISCRIMINATOR,
    parseLiquidateInstruction,
    type ParsedLiquidateInstruction,
} from '../instructions/liquidate';
import {
    LIQUIDATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR,
    parseLiquidatePerfectDexInstruction,
    type ParsedLiquidatePerfectDexInstruction,
} from '../instructions/liquidatePerfectDex';
import {
    OPERATE_DEX_INSTRUCTION_DISCRIMINATOR,
    parseOperateDexInstruction,
    type ParsedOperateDexInstruction,
} from '../instructions/operateDex';
import {
    OPERATE_INSTRUCTION_DISCRIMINATOR,
    parseOperateInstruction,
    type ParsedOperateInstruction,
} from '../instructions/operate';
import {
    OPERATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR,
    parseOperatePerfectDexInstruction,
    type ParsedOperatePerfectDexInstruction,
} from '../instructions/operatePerfectDex';
import { ORACLE_ACCOUNT_DISCRIMINATOR } from '../accounts/oracle';
import { POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/position';
import {
    REBALANCE_DEX_INSTRUCTION_DISCRIMINATOR,
    parseRebalanceDexInstruction,
    type ParsedRebalanceDexInstruction,
} from '../instructions/rebalanceDex';
import {
    REBALANCE_DEX_WITH_AMOUNTS_INSTRUCTION_DISCRIMINATOR,
    parseRebalanceDexWithAmountsInstruction,
    type ParsedRebalanceDexWithAmountsInstruction,
} from '../instructions/rebalanceDexWithAmounts';
import {
    REBALANCE_INSTRUCTION_DISCRIMINATOR,
    parseRebalanceInstruction,
    type ParsedRebalanceInstruction,
} from '../instructions/rebalance';
import {
    REBALANCE_WITH_AMOUNTS_INSTRUCTION_DISCRIMINATOR,
    parseRebalanceWithAmountsInstruction,
    type ParsedRebalanceWithAmountsInstruction,
} from '../instructions/rebalanceWithAmounts';
import { TICK_ACCOUNT_DISCRIMINATOR } from '../accounts/tick';
import { TICK_HAS_DEBT_ARRAY_ACCOUNT_DISCRIMINATOR } from '../accounts/tickHasDebtArray';
import { TICK_ID_LIQUIDATION_ACCOUNT_DISCRIMINATOR } from '../accounts/tickIdLiquidation';
import { TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR } from '../accounts/tokenReserve';
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
    UPDATE_BORROW_FEE_INSTRUCTION_DISCRIMINATOR,
    parseUpdateBorrowFeeInstruction,
    type ParsedUpdateBorrowFeeInstruction,
} from '../instructions/updateBorrowFee';
import {
    UPDATE_BORROW_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR,
    parseUpdateBorrowRateMagnifierInstruction,
    type ParsedUpdateBorrowRateMagnifierInstruction,
} from '../instructions/updateBorrowRateMagnifier';
import {
    UPDATE_COLLATERAL_FACTOR_INSTRUCTION_DISCRIMINATOR,
    parseUpdateCollateralFactorInstruction,
    type ParsedUpdateCollateralFactorInstruction,
} from '../instructions/updateCollateralFactor';
import {
    UPDATE_CORE_SETTINGS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateCoreSettingsInstruction,
    type ParsedUpdateCoreSettingsInstruction,
} from '../instructions/updateCoreSettings';
import {
    UPDATE_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR,
    parseUpdateExchangePricesInstruction,
    type ParsedUpdateExchangePricesInstruction,
} from '../instructions/updateExchangePrices';
import {
    UPDATE_LIQUIDATION_MAX_LIMIT_INSTRUCTION_DISCRIMINATOR,
    parseUpdateLiquidationMaxLimitInstruction,
    type ParsedUpdateLiquidationMaxLimitInstruction,
} from '../instructions/updateLiquidationMaxLimit';
import {
    UPDATE_LIQUIDATION_PENALTY_INSTRUCTION_DISCRIMINATOR,
    parseUpdateLiquidationPenaltyInstruction,
    type ParsedUpdateLiquidationPenaltyInstruction,
} from '../instructions/updateLiquidationPenalty';
import {
    UPDATE_LIQUIDATION_THRESHOLD_INSTRUCTION_DISCRIMINATOR,
    parseUpdateLiquidationThresholdInstruction,
    type ParsedUpdateLiquidationThresholdInstruction,
} from '../instructions/updateLiquidationThreshold';
import {
    UPDATE_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR,
    parseUpdateLookupTableInstruction,
    type ParsedUpdateLookupTableInstruction,
} from '../instructions/updateLookupTable';
import {
    UPDATE_ORACLE_INSTRUCTION_DISCRIMINATOR,
    parseUpdateOracleInstruction,
    type ParsedUpdateOracleInstruction,
} from '../instructions/updateOracle';
import {
    UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRebalancerInstruction,
    type ParsedUpdateRebalancerInstruction,
} from '../instructions/updateRebalancer';
import {
    UPDATE_SUPPLY_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR,
    parseUpdateSupplyRateMagnifierInstruction,
    type ParsedUpdateSupplyRateMagnifierInstruction,
} from '../instructions/updateSupplyRateMagnifier';
import {
    UPDATE_WITHDRAW_GAP_INSTRUCTION_DISCRIMINATOR,
    parseUpdateWithdrawGapInstruction,
    type ParsedUpdateWithdrawGapInstruction,
} from '../instructions/updateWithdrawGap';
import { USER_BORROW_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userBorrowPosition';
import { USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userSupplyPosition';
import { VAULT_ADMIN_ACCOUNT_DISCRIMINATOR } from '../accounts/vaultAdmin';
import { VAULT_CONFIG_ACCOUNT_DISCRIMINATOR } from '../accounts/vaultConfig';
import { VAULT_METADATA_ACCOUNT_DISCRIMINATOR } from '../accounts/vaultMetadata';
import { VAULT_STATE_ACCOUNT_DISCRIMINATOR } from '../accounts/vaultState';

export const LENDBORROW_PROGRAM_ID = new Address('jupr81YtYssSyPt8jbnGuiWon5f6x9TcDEFxYe3Bdzi');
export const LEND_BORROW_PROGRAM_ADDRESS = LENDBORROW_PROGRAM_ID;

export interface LendBorrowProgram {
    name: 'lendBorrow';
    programId: Address;
}

export function getLendBorrowProgram(programId: Address = LENDBORROW_PROGRAM_ID): LendBorrowProgram {
    return { name: 'lendBorrow', programId };
}

export enum LendBorrowAccount {
    Branch,
    Dex,
    DexPosition,
    Oracle,
    Position,
    Tick,
    TickHasDebtArray,
    TickIdLiquidation,
    TokenReserve,
    UserBorrowPosition,
    UserSupplyPosition,
    VaultAdmin,
    VaultConfig,
    VaultMetadata,
    VaultState,
}

export function identifyLendBorrowAccount(account: { data: Uint8Array } | Uint8Array): LendBorrowAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (BRANCH_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendBorrowAccount.Branch;
    if (DEX_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendBorrowAccount.Dex;
    if (DEX_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.DexPosition;
    if (ORACLE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendBorrowAccount.Oracle;
    if (POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.Position;
    if (TICK_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendBorrowAccount.Tick;
    if (TICK_HAS_DEBT_ARRAY_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.TickHasDebtArray;
    if (TICK_ID_LIQUIDATION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.TickIdLiquidation;
    if (TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.TokenReserve;
    if (USER_BORROW_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.UserBorrowPosition;
    if (USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.UserSupplyPosition;
    if (VAULT_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.VaultAdmin;
    if (VAULT_CONFIG_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.VaultConfig;
    if (VAULT_METADATA_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.VaultMetadata;
    if (VAULT_STATE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowAccount.VaultState;
    throw new Error('Failed to identify LendBorrow account');
}

export enum LendBorrowInstruction {
    GetExchangePrices,
    InitBranch,
    InitPosition,
    InitTick,
    InitTickHasDebtArray,
    InitTickIdLiquidation,
    InitVaultAdmin,
    InitVaultConfig,
    InitVaultState,
    Liquidate,
    LiquidateDex,
    LiquidatePerfectDex,
    Operate,
    OperateDex,
    OperatePerfectDex,
    Rebalance,
    RebalanceDex,
    RebalanceDexWithAmounts,
    RebalanceWithAmounts,
    UpdateAuthority,
    UpdateAuths,
    UpdateBorrowFee,
    UpdateBorrowRateMagnifier,
    UpdateCollateralFactor,
    UpdateCoreSettings,
    UpdateExchangePrices,
    UpdateLiquidationMaxLimit,
    UpdateLiquidationPenalty,
    UpdateLiquidationThreshold,
    UpdateLookupTable,
    UpdateOracle,
    UpdateRebalancer,
    UpdateSupplyRateMagnifier,
    UpdateWithdrawGap,
}

export function identifyLendBorrowInstruction(instruction: { data: Uint8Array } | Uint8Array): LendBorrowInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (GET_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.GetExchangePrices;
    if (INIT_BRANCH_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitBranch;
    if (INIT_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitPosition;
    if (INIT_TICK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitTick;
    if (INIT_TICK_HAS_DEBT_ARRAY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitTickHasDebtArray;
    if (INIT_TICK_ID_LIQUIDATION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitTickIdLiquidation;
    if (INIT_VAULT_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitVaultAdmin;
    if (INIT_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitVaultConfig;
    if (INIT_VAULT_STATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.InitVaultState;
    if (LIQUIDATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.Liquidate;
    if (LIQUIDATE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.LiquidateDex;
    if (LIQUIDATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.LiquidatePerfectDex;
    if (OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.Operate;
    if (OPERATE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.OperateDex;
    if (OPERATE_PERFECT_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.OperatePerfectDex;
    if (REBALANCE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.Rebalance;
    if (REBALANCE_DEX_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.RebalanceDex;
    if (REBALANCE_DEX_WITH_AMOUNTS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.RebalanceDexWithAmounts;
    if (REBALANCE_WITH_AMOUNTS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.RebalanceWithAmounts;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateAuthority;
    if (UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateAuths;
    if (UPDATE_BORROW_FEE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateBorrowFee;
    if (UPDATE_BORROW_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateBorrowRateMagnifier;
    if (UPDATE_COLLATERAL_FACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateCollateralFactor;
    if (UPDATE_CORE_SETTINGS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateCoreSettings;
    if (UPDATE_EXCHANGE_PRICES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateExchangePrices;
    if (UPDATE_LIQUIDATION_MAX_LIMIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateLiquidationMaxLimit;
    if (UPDATE_LIQUIDATION_PENALTY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateLiquidationPenalty;
    if (UPDATE_LIQUIDATION_THRESHOLD_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateLiquidationThreshold;
    if (UPDATE_LOOKUP_TABLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateLookupTable;
    if (UPDATE_ORACLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateOracle;
    if (UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateRebalancer;
    if (UPDATE_SUPPLY_RATE_MAGNIFIER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateSupplyRateMagnifier;
    if (UPDATE_WITHDRAW_GAP_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendBorrowInstruction.UpdateWithdrawGap;
    throw new Error('Failed to identify LendBorrow instruction');
}

export type ParsedLendBorrowInstruction =
    | ({ instructionType: LendBorrowInstruction.GetExchangePrices } & ParsedGetExchangePricesInstruction)
    | ({ instructionType: LendBorrowInstruction.InitBranch } & ParsedInitBranchInstruction)
    | ({ instructionType: LendBorrowInstruction.InitPosition } & ParsedInitPositionInstruction)
    | ({ instructionType: LendBorrowInstruction.InitTick } & ParsedInitTickInstruction)
    | ({ instructionType: LendBorrowInstruction.InitTickHasDebtArray } & ParsedInitTickHasDebtArrayInstruction)
    | ({ instructionType: LendBorrowInstruction.InitTickIdLiquidation } & ParsedInitTickIdLiquidationInstruction)
    | ({ instructionType: LendBorrowInstruction.InitVaultAdmin } & ParsedInitVaultAdminInstruction)
    | ({ instructionType: LendBorrowInstruction.InitVaultConfig } & ParsedInitVaultConfigInstruction)
    | ({ instructionType: LendBorrowInstruction.InitVaultState } & ParsedInitVaultStateInstruction)
    | ({ instructionType: LendBorrowInstruction.Liquidate } & ParsedLiquidateInstruction)
    | ({ instructionType: LendBorrowInstruction.LiquidateDex } & ParsedLiquidateDexInstruction)
    | ({ instructionType: LendBorrowInstruction.LiquidatePerfectDex } & ParsedLiquidatePerfectDexInstruction)
    | ({ instructionType: LendBorrowInstruction.Operate } & ParsedOperateInstruction)
    | ({ instructionType: LendBorrowInstruction.OperateDex } & ParsedOperateDexInstruction)
    | ({ instructionType: LendBorrowInstruction.OperatePerfectDex } & ParsedOperatePerfectDexInstruction)
    | ({ instructionType: LendBorrowInstruction.Rebalance } & ParsedRebalanceInstruction)
    | ({ instructionType: LendBorrowInstruction.RebalanceDex } & ParsedRebalanceDexInstruction)
    | ({ instructionType: LendBorrowInstruction.RebalanceDexWithAmounts } & ParsedRebalanceDexWithAmountsInstruction)
    | ({ instructionType: LendBorrowInstruction.RebalanceWithAmounts } & ParsedRebalanceWithAmountsInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateAuths } & ParsedUpdateAuthsInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateBorrowFee } & ParsedUpdateBorrowFeeInstruction)
    | ({
          instructionType: LendBorrowInstruction.UpdateBorrowRateMagnifier;
      } & ParsedUpdateBorrowRateMagnifierInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateCollateralFactor } & ParsedUpdateCollateralFactorInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateCoreSettings } & ParsedUpdateCoreSettingsInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateExchangePrices } & ParsedUpdateExchangePricesInstruction)
    | ({
          instructionType: LendBorrowInstruction.UpdateLiquidationMaxLimit;
      } & ParsedUpdateLiquidationMaxLimitInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateLiquidationPenalty } & ParsedUpdateLiquidationPenaltyInstruction)
    | ({
          instructionType: LendBorrowInstruction.UpdateLiquidationThreshold;
      } & ParsedUpdateLiquidationThresholdInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateLookupTable } & ParsedUpdateLookupTableInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateOracle } & ParsedUpdateOracleInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateRebalancer } & ParsedUpdateRebalancerInstruction)
    | ({
          instructionType: LendBorrowInstruction.UpdateSupplyRateMagnifier;
      } & ParsedUpdateSupplyRateMagnifierInstruction)
    | ({ instructionType: LendBorrowInstruction.UpdateWithdrawGap } & ParsedUpdateWithdrawGapInstruction);

export function parseLendBorrowInstruction(instruction: TransactionInstruction): ParsedLendBorrowInstruction {
    const instructionType = identifyLendBorrowInstruction(instruction);
    switch (instructionType) {
        case LendBorrowInstruction.GetExchangePrices:
            return {
                instructionType,
                ...parseGetExchangePricesInstruction(instruction),
            };
        case LendBorrowInstruction.InitBranch:
            return {
                instructionType,
                ...parseInitBranchInstruction(instruction),
            };
        case LendBorrowInstruction.InitPosition:
            return {
                instructionType,
                ...parseInitPositionInstruction(instruction),
            };
        case LendBorrowInstruction.InitTick:
            return {
                instructionType,
                ...parseInitTickInstruction(instruction),
            };
        case LendBorrowInstruction.InitTickHasDebtArray:
            return {
                instructionType,
                ...parseInitTickHasDebtArrayInstruction(instruction),
            };
        case LendBorrowInstruction.InitTickIdLiquidation:
            return {
                instructionType,
                ...parseInitTickIdLiquidationInstruction(instruction),
            };
        case LendBorrowInstruction.InitVaultAdmin:
            return {
                instructionType,
                ...parseInitVaultAdminInstruction(instruction),
            };
        case LendBorrowInstruction.InitVaultConfig:
            return {
                instructionType,
                ...parseInitVaultConfigInstruction(instruction),
            };
        case LendBorrowInstruction.InitVaultState:
            return {
                instructionType,
                ...parseInitVaultStateInstruction(instruction),
            };
        case LendBorrowInstruction.Liquidate:
            return {
                instructionType,
                ...parseLiquidateInstruction(instruction),
            };
        case LendBorrowInstruction.LiquidateDex:
            return {
                instructionType,
                ...parseLiquidateDexInstruction(instruction),
            };
        case LendBorrowInstruction.LiquidatePerfectDex:
            return {
                instructionType,
                ...parseLiquidatePerfectDexInstruction(instruction),
            };
        case LendBorrowInstruction.Operate:
            return {
                instructionType,
                ...parseOperateInstruction(instruction),
            };
        case LendBorrowInstruction.OperateDex:
            return {
                instructionType,
                ...parseOperateDexInstruction(instruction),
            };
        case LendBorrowInstruction.OperatePerfectDex:
            return {
                instructionType,
                ...parseOperatePerfectDexInstruction(instruction),
            };
        case LendBorrowInstruction.Rebalance:
            return {
                instructionType,
                ...parseRebalanceInstruction(instruction),
            };
        case LendBorrowInstruction.RebalanceDex:
            return {
                instructionType,
                ...parseRebalanceDexInstruction(instruction),
            };
        case LendBorrowInstruction.RebalanceDexWithAmounts:
            return {
                instructionType,
                ...parseRebalanceDexWithAmountsInstruction(instruction),
            };
        case LendBorrowInstruction.RebalanceWithAmounts:
            return {
                instructionType,
                ...parseRebalanceWithAmountsInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateAuths:
            return {
                instructionType,
                ...parseUpdateAuthsInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateBorrowFee:
            return {
                instructionType,
                ...parseUpdateBorrowFeeInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateBorrowRateMagnifier:
            return {
                instructionType,
                ...parseUpdateBorrowRateMagnifierInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateCollateralFactor:
            return {
                instructionType,
                ...parseUpdateCollateralFactorInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateCoreSettings:
            return {
                instructionType,
                ...parseUpdateCoreSettingsInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateExchangePrices:
            return {
                instructionType,
                ...parseUpdateExchangePricesInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateLiquidationMaxLimit:
            return {
                instructionType,
                ...parseUpdateLiquidationMaxLimitInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateLiquidationPenalty:
            return {
                instructionType,
                ...parseUpdateLiquidationPenaltyInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateLiquidationThreshold:
            return {
                instructionType,
                ...parseUpdateLiquidationThresholdInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateLookupTable:
            return {
                instructionType,
                ...parseUpdateLookupTableInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateOracle:
            return {
                instructionType,
                ...parseUpdateOracleInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateRebalancer:
            return {
                instructionType,
                ...parseUpdateRebalancerInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateSupplyRateMagnifier:
            return {
                instructionType,
                ...parseUpdateSupplyRateMagnifierInstruction(instruction),
            };
        case LendBorrowInstruction.UpdateWithdrawGap:
            return {
                instructionType,
                ...parseUpdateWithdrawGapInstruction(instruction),
            };
    }
}
