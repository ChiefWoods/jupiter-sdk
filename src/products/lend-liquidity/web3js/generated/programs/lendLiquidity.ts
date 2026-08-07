import { AUTHORIZATION_LIST_ACCOUNT_DISCRIMINATOR } from '../accounts/authorizationList';
import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CHANGE_STATUS_INSTRUCTION_DISCRIMINATOR,
    parseChangeStatusInstruction,
    type ParsedChangeStatusInstruction,
} from '../instructions/changeStatus';
import {
    CLAIM_INSTRUCTION_DISCRIMINATOR,
    parseClaimInstruction,
    type ParsedClaimInstruction,
} from '../instructions/claim';
import {
    CLOSE_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR,
    parseCloseClaimAccountInstruction,
    type ParsedCloseClaimAccountInstruction,
} from '../instructions/closeClaimAccount';
import {
    COLLECT_REVENUE_INSTRUCTION_DISCRIMINATOR,
    parseCollectRevenueInstruction,
    type ParsedCollectRevenueInstruction,
} from '../instructions/collectRevenue';
import {
    INIT_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR,
    parseInitClaimAccountInstruction,
    type ParsedInitClaimAccountInstruction,
} from '../instructions/initClaimAccount';
import {
    INIT_LIQUIDITY_INSTRUCTION_DISCRIMINATOR,
    parseInitLiquidityInstruction,
    type ParsedInitLiquidityInstruction,
} from '../instructions/initLiquidity';
import {
    INIT_NEW_PROTOCOL_INSTRUCTION_DISCRIMINATOR,
    parseInitNewProtocolInstruction,
    type ParsedInitNewProtocolInstruction,
} from '../instructions/initNewProtocol';
import {
    INIT_TOKEN_RESERVE_INSTRUCTION_DISCRIMINATOR,
    parseInitTokenReserveInstruction,
    type ParsedInitTokenReserveInstruction,
} from '../instructions/initTokenReserve';
import { LIQUIDITY_ACCOUNT_DISCRIMINATOR } from '../accounts/liquidity';
import {
    OPERATE_INSTRUCTION_DISCRIMINATOR,
    parseOperateInstruction,
    type ParsedOperateInstruction,
} from '../instructions/operate';
import {
    PAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parsePauseTokenInstruction,
    type ParsedPauseTokenInstruction,
} from '../instructions/pauseToken';
import {
    PAUSE_USER_INSTRUCTION_DISCRIMINATOR,
    parsePauseUserInstruction,
    type ParsedPauseUserInstruction,
} from '../instructions/pauseUser';
import {
    PRE_OPERATE_INSTRUCTION_DISCRIMINATOR,
    parsePreOperateInstruction,
    type ParsedPreOperateInstruction,
} from '../instructions/preOperate';
import { RATE_MODEL_ACCOUNT_DISCRIMINATOR } from '../accounts/rateModel';
import { TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR } from '../accounts/tokenReserve';
import {
    UNPAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseUnpauseTokenInstruction,
    type ParsedUnpauseTokenInstruction,
} from '../instructions/unpauseToken';
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
    UPDATE_EXCHANGE_PRICE_INSTRUCTION_DISCRIMINATOR,
    parseUpdateExchangePriceInstruction,
    type ParsedUpdateExchangePriceInstruction,
} from '../instructions/updateExchangePrice';
import {
    UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateGuardiansInstruction,
    type ParsedUpdateGuardiansInstruction,
} from '../instructions/updateGuardians';
import {
    UPDATE_RATE_DATA_V1_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRateDataV1Instruction,
    type ParsedUpdateRateDataV1Instruction,
} from '../instructions/updateRateDataV1';
import {
    UPDATE_RATE_DATA_V2_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRateDataV2Instruction,
    type ParsedUpdateRateDataV2Instruction,
} from '../instructions/updateRateDataV2';
import {
    UPDATE_REVENUE_COLLECTOR_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRevenueCollectorInstruction,
    type ParsedUpdateRevenueCollectorInstruction,
} from '../instructions/updateRevenueCollector';
import {
    UPDATE_TOKEN_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseUpdateTokenConfigInstruction,
    type ParsedUpdateTokenConfigInstruction,
} from '../instructions/updateTokenConfig';
import {
    UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseUpdateUserBorrowConfigInstruction,
    type ParsedUpdateUserBorrowConfigInstruction,
} from '../instructions/updateUserBorrowConfig';
import {
    UPDATE_USER_CLASS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateUserClassInstruction,
    type ParsedUpdateUserClassInstruction,
} from '../instructions/updateUserClass';
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
import { USER_BORROW_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userBorrowPosition';
import { USER_CLAIM_ACCOUNT_DISCRIMINATOR } from '../accounts/userClaim';
import { USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userSupplyPosition';

export const LENDLIQUIDITY_PROGRAM_ID = new Address('jupeiUmn818Jg1ekPURTpr4mFo29p46vygyykFJ3wZC');
export const LEND_LIQUIDITY_PROGRAM_ADDRESS = LENDLIQUIDITY_PROGRAM_ID;

export interface LendLiquidityProgram {
    name: 'lendLiquidity';
    programId: Address;
}

export function getLendLiquidityProgram(programId: Address = LENDLIQUIDITY_PROGRAM_ID): LendLiquidityProgram {
    return { name: 'lendLiquidity', programId };
}

export enum LendLiquidityAccount {
    AuthorizationList,
    Liquidity,
    RateModel,
    TokenReserve,
    UserBorrowPosition,
    UserClaim,
    UserSupplyPosition,
}

export function identifyLendLiquidityAccount(account: { data: Uint8Array } | Uint8Array): LendLiquidityAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (AUTHORIZATION_LIST_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.AuthorizationList;
    if (LIQUIDITY_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.Liquidity;
    if (RATE_MODEL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.RateModel;
    if (TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.TokenReserve;
    if (USER_BORROW_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.UserBorrowPosition;
    if (USER_CLAIM_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.UserClaim;
    if (USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityAccount.UserSupplyPosition;
    throw new Error('Failed to identify LendLiquidity account');
}

export enum LendLiquidityInstruction {
    ChangeStatus,
    Claim,
    CloseClaimAccount,
    CollectRevenue,
    InitClaimAccount,
    InitLiquidity,
    InitNewProtocol,
    InitTokenReserve,
    Operate,
    PauseToken,
    PauseUser,
    PreOperate,
    UnpauseToken,
    UnpauseUser,
    UpdateAuthority,
    UpdateAuths,
    UpdateExchangePrice,
    UpdateGuardians,
    UpdateRateDataV1,
    UpdateRateDataV2,
    UpdateRevenueCollector,
    UpdateTokenConfig,
    UpdateUserBorrowConfig,
    UpdateUserClass,
    UpdateUserSupplyConfig,
    UpdateUserWithdrawalLimit,
}

export function identifyLendLiquidityInstruction(
    instruction: { data: Uint8Array } | Uint8Array,
): LendLiquidityInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CHANGE_STATUS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.ChangeStatus;
    if (CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.Claim;
    if (CLOSE_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.CloseClaimAccount;
    if (COLLECT_REVENUE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.CollectRevenue;
    if (INIT_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.InitClaimAccount;
    if (INIT_LIQUIDITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.InitLiquidity;
    if (INIT_NEW_PROTOCOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.InitNewProtocol;
    if (INIT_TOKEN_RESERVE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.InitTokenReserve;
    if (OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.Operate;
    if (PAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.PauseToken;
    if (PAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.PauseUser;
    if (PRE_OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.PreOperate;
    if (UNPAUSE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UnpauseToken;
    if (UNPAUSE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UnpauseUser;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateAuthority;
    if (UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateAuths;
    if (UPDATE_EXCHANGE_PRICE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateExchangePrice;
    if (UPDATE_GUARDIANS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateGuardians;
    if (UPDATE_RATE_DATA_V1_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateRateDataV1;
    if (UPDATE_RATE_DATA_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateRateDataV2;
    if (UPDATE_REVENUE_COLLECTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateRevenueCollector;
    if (UPDATE_TOKEN_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateTokenConfig;
    if (UPDATE_USER_BORROW_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateUserBorrowConfig;
    if (UPDATE_USER_CLASS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateUserClass;
    if (UPDATE_USER_SUPPLY_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateUserSupplyConfig;
    if (UPDATE_USER_WITHDRAWAL_LIMIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendLiquidityInstruction.UpdateUserWithdrawalLimit;
    throw new Error('Failed to identify LendLiquidity instruction');
}

export type ParsedLendLiquidityInstruction =
    | ({ instructionType: LendLiquidityInstruction.ChangeStatus } & ParsedChangeStatusInstruction)
    | ({ instructionType: LendLiquidityInstruction.Claim } & ParsedClaimInstruction)
    | ({ instructionType: LendLiquidityInstruction.CloseClaimAccount } & ParsedCloseClaimAccountInstruction)
    | ({ instructionType: LendLiquidityInstruction.CollectRevenue } & ParsedCollectRevenueInstruction)
    | ({ instructionType: LendLiquidityInstruction.InitClaimAccount } & ParsedInitClaimAccountInstruction)
    | ({ instructionType: LendLiquidityInstruction.InitLiquidity } & ParsedInitLiquidityInstruction)
    | ({ instructionType: LendLiquidityInstruction.InitNewProtocol } & ParsedInitNewProtocolInstruction)
    | ({ instructionType: LendLiquidityInstruction.InitTokenReserve } & ParsedInitTokenReserveInstruction)
    | ({ instructionType: LendLiquidityInstruction.Operate } & ParsedOperateInstruction)
    | ({ instructionType: LendLiquidityInstruction.PauseToken } & ParsedPauseTokenInstruction)
    | ({ instructionType: LendLiquidityInstruction.PauseUser } & ParsedPauseUserInstruction)
    | ({ instructionType: LendLiquidityInstruction.PreOperate } & ParsedPreOperateInstruction)
    | ({ instructionType: LendLiquidityInstruction.UnpauseToken } & ParsedUnpauseTokenInstruction)
    | ({ instructionType: LendLiquidityInstruction.UnpauseUser } & ParsedUnpauseUserInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateAuths } & ParsedUpdateAuthsInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateExchangePrice } & ParsedUpdateExchangePriceInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateGuardians } & ParsedUpdateGuardiansInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateRateDataV1 } & ParsedUpdateRateDataV1Instruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateRateDataV2 } & ParsedUpdateRateDataV2Instruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateRevenueCollector } & ParsedUpdateRevenueCollectorInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateTokenConfig } & ParsedUpdateTokenConfigInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateUserBorrowConfig } & ParsedUpdateUserBorrowConfigInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateUserClass } & ParsedUpdateUserClassInstruction)
    | ({ instructionType: LendLiquidityInstruction.UpdateUserSupplyConfig } & ParsedUpdateUserSupplyConfigInstruction)
    | ({
          instructionType: LendLiquidityInstruction.UpdateUserWithdrawalLimit;
      } & ParsedUpdateUserWithdrawalLimitInstruction);

export function parseLendLiquidityInstruction(instruction: TransactionInstruction): ParsedLendLiquidityInstruction {
    const instructionType = identifyLendLiquidityInstruction(instruction);
    switch (instructionType) {
        case LendLiquidityInstruction.ChangeStatus:
            return {
                instructionType,
                ...parseChangeStatusInstruction(instruction),
            };
        case LendLiquidityInstruction.Claim:
            return {
                instructionType,
                ...parseClaimInstruction(instruction),
            };
        case LendLiquidityInstruction.CloseClaimAccount:
            return {
                instructionType,
                ...parseCloseClaimAccountInstruction(instruction),
            };
        case LendLiquidityInstruction.CollectRevenue:
            return {
                instructionType,
                ...parseCollectRevenueInstruction(instruction),
            };
        case LendLiquidityInstruction.InitClaimAccount:
            return {
                instructionType,
                ...parseInitClaimAccountInstruction(instruction),
            };
        case LendLiquidityInstruction.InitLiquidity:
            return {
                instructionType,
                ...parseInitLiquidityInstruction(instruction),
            };
        case LendLiquidityInstruction.InitNewProtocol:
            return {
                instructionType,
                ...parseInitNewProtocolInstruction(instruction),
            };
        case LendLiquidityInstruction.InitTokenReserve:
            return {
                instructionType,
                ...parseInitTokenReserveInstruction(instruction),
            };
        case LendLiquidityInstruction.Operate:
            return {
                instructionType,
                ...parseOperateInstruction(instruction),
            };
        case LendLiquidityInstruction.PauseToken:
            return {
                instructionType,
                ...parsePauseTokenInstruction(instruction),
            };
        case LendLiquidityInstruction.PauseUser:
            return {
                instructionType,
                ...parsePauseUserInstruction(instruction),
            };
        case LendLiquidityInstruction.PreOperate:
            return {
                instructionType,
                ...parsePreOperateInstruction(instruction),
            };
        case LendLiquidityInstruction.UnpauseToken:
            return {
                instructionType,
                ...parseUnpauseTokenInstruction(instruction),
            };
        case LendLiquidityInstruction.UnpauseUser:
            return {
                instructionType,
                ...parseUnpauseUserInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateAuths:
            return {
                instructionType,
                ...parseUpdateAuthsInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateExchangePrice:
            return {
                instructionType,
                ...parseUpdateExchangePriceInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateGuardians:
            return {
                instructionType,
                ...parseUpdateGuardiansInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateRateDataV1:
            return {
                instructionType,
                ...parseUpdateRateDataV1Instruction(instruction),
            };
        case LendLiquidityInstruction.UpdateRateDataV2:
            return {
                instructionType,
                ...parseUpdateRateDataV2Instruction(instruction),
            };
        case LendLiquidityInstruction.UpdateRevenueCollector:
            return {
                instructionType,
                ...parseUpdateRevenueCollectorInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateTokenConfig:
            return {
                instructionType,
                ...parseUpdateTokenConfigInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateUserBorrowConfig:
            return {
                instructionType,
                ...parseUpdateUserBorrowConfigInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateUserClass:
            return {
                instructionType,
                ...parseUpdateUserClassInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateUserSupplyConfig:
            return {
                instructionType,
                ...parseUpdateUserSupplyConfigInstruction(instruction),
            };
        case LendLiquidityInstruction.UpdateUserWithdrawalLimit:
            return {
                instructionType,
                ...parseUpdateUserWithdrawalLimitInstruction(instruction),
            };
    }
}
