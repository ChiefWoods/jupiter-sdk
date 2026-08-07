import {
    ADD_CUSTODY_INSTRUCTION_DISCRIMINATOR,
    parseAddCustodyInstruction,
    type ParsedAddCustodyInstruction,
} from '../instructions/addCustody';
import {
    ADD_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR,
    parseAddLiquidity2Instruction,
    type ParsedAddLiquidity2Instruction,
} from '../instructions/addLiquidity2';
import {
    ADD_POOL_INSTRUCTION_DISCRIMINATOR,
    parseAddPoolInstruction,
    type ParsedAddPoolInstruction,
} from '../instructions/addPool';
import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    BORROW_FROM_CUSTODY_INSTRUCTION_DISCRIMINATOR,
    parseBorrowFromCustodyInstruction,
    type ParsedBorrowFromCustodyInstruction,
} from '../instructions/borrowFromCustody';
import { BORROW_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/borrowPosition';
import {
    CLOSE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseCloseBorrowPositionInstruction,
    type ParsedCloseBorrowPositionInstruction,
} from '../instructions/closeBorrowPosition';
import {
    CLOSE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR,
    parseClosePositionRequest2Instruction,
    type ParsedClosePositionRequest2Instruction,
} from '../instructions/closePositionRequest2';
import {
    CLOSE_POSITION_REQUEST3_INSTRUCTION_DISCRIMINATOR,
    parseClosePositionRequest3Instruction,
    type ParsedClosePositionRequest3Instruction,
} from '../instructions/closePositionRequest3';
import {
    CREATE_AND_DELEGATE_STAKE_ACCOUNT_INSTRUCTION_DISCRIMINATOR,
    parseCreateAndDelegateStakeAccountInstruction,
    type ParsedCreateAndDelegateStakeAccountInstruction,
} from '../instructions/createAndDelegateStakeAccount';
import {
    CREATE_DECREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR,
    parseCreateDecreasePositionMarketRequestInstruction,
    type ParsedCreateDecreasePositionMarketRequestInstruction,
} from '../instructions/createDecreasePositionMarketRequest';
import {
    CREATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR,
    parseCreateDecreasePositionRequest2Instruction,
    type ParsedCreateDecreasePositionRequest2Instruction,
} from '../instructions/createDecreasePositionRequest2';
import {
    CREATE_INCREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR,
    parseCreateIncreasePositionMarketRequestInstruction,
    type ParsedCreateIncreasePositionMarketRequestInstruction,
} from '../instructions/createIncreasePositionMarketRequest';
import {
    CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseCreateTokenLedgerInstruction,
    type ParsedCreateTokenLedgerInstruction,
} from '../instructions/createTokenLedger';
import {
    CREATE_TOKEN_METADATA_INSTRUCTION_DISCRIMINATOR,
    parseCreateTokenMetadataInstruction,
    type ParsedCreateTokenMetadataInstruction,
} from '../instructions/createTokenMetadata';
import { CUSTODY_ACCOUNT_DISCRIMINATOR } from '../accounts/custody';
import {
    DECREASE_POSITION4_INSTRUCTION_DISCRIMINATOR,
    parseDecreasePosition4Instruction,
    type ParsedDecreasePosition4Instruction,
} from '../instructions/decreasePosition4';
import {
    DECREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR,
    parseDecreasePositionWithInternalSwapInstruction,
    type ParsedDecreasePositionWithInternalSwapInstruction,
} from '../instructions/decreasePositionWithInternalSwap';
import {
    DECREASE_POSITION_WITH_TPSL_AND_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR,
    parseDecreasePositionWithTpslAndInternalSwapInstruction,
    type ParsedDecreasePositionWithTpslAndInternalSwapInstruction,
} from '../instructions/decreasePositionWithTpslAndInternalSwap';
import {
    DECREASE_POSITION_WITH_TPSL_INSTRUCTION_DISCRIMINATOR,
    parseDecreasePositionWithTpslInstruction,
    type ParsedDecreasePositionWithTpslInstruction,
} from '../instructions/decreasePositionWithTpsl';
import {
    DEPOSIT_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR,
    parseDepositCollateralForBorrowsInstruction,
    type ParsedDepositCollateralForBorrowsInstruction,
} from '../instructions/depositCollateralForBorrows';
import {
    GET_ADD_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR,
    parseGetAddLiquidityAmountAndFee2Instruction,
    type ParsedGetAddLiquidityAmountAndFee2Instruction,
} from '../instructions/getAddLiquidityAmountAndFee2';
import {
    GET_ASSETS_UNDER_MANAGEMENT2_INSTRUCTION_DISCRIMINATOR,
    parseGetAssetsUnderManagement2Instruction,
    type ParsedGetAssetsUnderManagement2Instruction,
} from '../instructions/getAssetsUnderManagement2';
import {
    GET_REMOVE_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR,
    parseGetRemoveLiquidityAmountAndFee2Instruction,
    type ParsedGetRemoveLiquidityAmountAndFee2Instruction,
} from '../instructions/getRemoveLiquidityAmountAndFee2';
import {
    INCREASE_POSITION4_INSTRUCTION_DISCRIMINATOR,
    parseIncreasePosition4Instruction,
    type ParsedIncreasePosition4Instruction,
} from '../instructions/increasePosition4';
import {
    INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR,
    parseIncreasePositionPreSwapInstruction,
    type ParsedIncreasePositionPreSwapInstruction,
} from '../instructions/increasePositionPreSwap';
import {
    INCREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR,
    parseIncreasePositionWithInternalSwapInstruction,
    type ParsedIncreasePositionWithInternalSwapInstruction,
} from '../instructions/increasePositionWithInternalSwap';
import { INIT_INSTRUCTION_DISCRIMINATOR, parseInitInstruction, type ParsedInitInstruction } from '../instructions/init';
import {
    INSTANT_CREATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseInstantCreateLimitOrderInstruction,
    type ParsedInstantCreateLimitOrderInstruction,
} from '../instructions/instantCreateLimitOrder';
import {
    INSTANT_CREATE_TPSL_INSTRUCTION_DISCRIMINATOR,
    parseInstantCreateTpslInstruction,
    type ParsedInstantCreateTpslInstruction,
} from '../instructions/instantCreateTpsl';
import {
    INSTANT_DECREASE_POSITION2_INSTRUCTION_DISCRIMINATOR,
    parseInstantDecreasePosition2Instruction,
    type ParsedInstantDecreasePosition2Instruction,
} from '../instructions/instantDecreasePosition2';
import {
    INSTANT_DECREASE_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseInstantDecreasePositionInstruction,
    type ParsedInstantDecreasePositionInstruction,
} from '../instructions/instantDecreasePosition';
import {
    INSTANT_INCREASE_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseInstantIncreasePositionInstruction,
    type ParsedInstantIncreasePositionInstruction,
} from '../instructions/instantIncreasePosition';
import {
    INSTANT_INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR,
    parseInstantIncreasePositionPreSwapInstruction,
    type ParsedInstantIncreasePositionPreSwapInstruction,
} from '../instructions/instantIncreasePositionPreSwap';
import {
    INSTANT_UPDATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseInstantUpdateLimitOrderInstruction,
    type ParsedInstantUpdateLimitOrderInstruction,
} from '../instructions/instantUpdateLimitOrder';
import {
    INSTANT_UPDATE_TPSL_INSTRUCTION_DISCRIMINATOR,
    parseInstantUpdateTpslInstruction,
    type ParsedInstantUpdateTpslInstruction,
} from '../instructions/instantUpdateTpsl';
import {
    LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseLiquidateBorrowPositionInstruction,
    type ParsedLiquidateBorrowPositionInstruction,
} from '../instructions/liquidateBorrowPosition';
import {
    LIQUIDATE_FULL_POSITION4_INSTRUCTION_DISCRIMINATOR,
    parseLiquidateFullPosition4Instruction,
    type ParsedLiquidateFullPosition4Instruction,
} from '../instructions/liquidateFullPosition4';
import {
    OPERATOR_SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseOperatorSetCustodyConfigInstruction,
    type ParsedOperatorSetCustodyConfigInstruction,
} from '../instructions/operatorSetCustodyConfig';
import {
    OPERATOR_SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseOperatorSetPoolConfigInstruction,
    type ParsedOperatorSetPoolConfigInstruction,
} from '../instructions/operatorSetPoolConfig';
import {
    PARTIAL_LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR,
    parsePartialLiquidateBorrowPositionInstruction,
    type ParsedPartialLiquidateBorrowPositionInstruction,
} from '../instructions/partialLiquidateBorrowPosition';
import { PERPETUALS_ACCOUNT_DISCRIMINATOR } from '../accounts/perpetuals';
import { POOL_ACCOUNT_DISCRIMINATOR } from '../accounts/pool';
import { POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/position';
import { POSITION_REQUEST_ACCOUNT_DISCRIMINATOR } from '../accounts/positionRequest';
import {
    REALLOC_CUSTODY_INSTRUCTION_DISCRIMINATOR,
    parseReallocCustodyInstruction,
    type ParsedReallocCustodyInstruction,
} from '../instructions/reallocCustody';
import {
    REALLOC_POOL_INSTRUCTION_DISCRIMINATOR,
    parseReallocPoolInstruction,
    type ParsedReallocPoolInstruction,
} from '../instructions/reallocPool';
import {
    REDEEM_STAKE_INSTRUCTION_DISCRIMINATOR,
    parseRedeemStakeInstruction,
    type ParsedRedeemStakeInstruction,
} from '../instructions/redeemStake';
import {
    REFRESH_ASSETS_UNDER_MANAGEMENT_INSTRUCTION_DISCRIMINATOR,
    parseRefreshAssetsUnderManagementInstruction,
    type ParsedRefreshAssetsUnderManagementInstruction,
} from '../instructions/refreshAssetsUnderManagement';
import {
    REMOVE_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR,
    parseRemoveLiquidity2Instruction,
    type ParsedRemoveLiquidity2Instruction,
} from '../instructions/removeLiquidity2';
import {
    REPAY_TO_CUSTODY_INSTRUCTION_DISCRIMINATOR,
    parseRepayToCustodyInstruction,
    type ParsedRepayToCustodyInstruction,
} from '../instructions/repayToCustody';
import {
    SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseSetCustodyConfigInstruction,
    type ParsedSetCustodyConfigInstruction,
} from '../instructions/setCustodyConfig';
import {
    SET_MAX_GLOBAL_SIZES_INSTRUCTION_DISCRIMINATOR,
    parseSetMaxGlobalSizesInstruction,
    type ParsedSetMaxGlobalSizesInstruction,
} from '../instructions/setMaxGlobalSizes';
import {
    SET_PERPETUALS_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseSetPerpetualsConfigInstruction,
    type ParsedSetPerpetualsConfigInstruction,
} from '../instructions/setPerpetualsConfig';
import {
    SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseSetPoolConfigInstruction,
    type ParsedSetPoolConfigInstruction,
} from '../instructions/setPoolConfig';
import {
    SET_TEST_TIME_INSTRUCTION_DISCRIMINATOR,
    parseSetTestTimeInstruction,
    type ParsedSetTestTimeInstruction,
} from '../instructions/setTestTime';
import {
    SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseSetTokenLedgerInstruction,
    type ParsedSetTokenLedgerInstruction,
} from '../instructions/setTokenLedger';
import { STAKE_INFO_ACCOUNT_DISCRIMINATOR } from '../accounts/stakeInfo';
import {
    SWAP2_INSTRUCTION_DISCRIMINATOR,
    parseSwap2Instruction,
    type ParsedSwap2Instruction,
} from '../instructions/swap2';
import {
    SWAP_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseSwapWithTokenLedgerInstruction,
    type ParsedSwapWithTokenLedgerInstruction,
} from '../instructions/swapWithTokenLedger';
import {
    TEST_INIT_INSTRUCTION_DISCRIMINATOR,
    parseTestInitInstruction,
    type ParsedTestInitInstruction,
} from '../instructions/testInit';
import { TOKEN_LEDGER_ACCOUNT_DISCRIMINATOR } from '../accounts/tokenLedger';
import {
    TRANSFER_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseTransferAdminInstruction,
    type ParsedTransferAdminInstruction,
} from '../instructions/transferAdmin';
import {
    UNSTAKE_INSTRUCTION_DISCRIMINATOR,
    parseUnstakeInstruction,
    type ParsedUnstakeInstruction,
} from '../instructions/unstake';
import {
    UPDATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR,
    parseUpdateDecreasePositionRequest2Instruction,
    type ParsedUpdateDecreasePositionRequest2Instruction,
} from '../instructions/updateDecreasePositionRequest2';
import {
    WITHDRAW_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawCollateralForBorrowsInstruction,
    type ParsedWithdrawCollateralForBorrowsInstruction,
} from '../instructions/withdrawCollateralForBorrows';
import {
    WITHDRAW_FEES2_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawFees2Instruction,
    type ParsedWithdrawFees2Instruction,
} from '../instructions/withdrawFees2';
import {
    WITHDRAW_STAKE_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawStakeInstruction,
    type ParsedWithdrawStakeInstruction,
} from '../instructions/withdrawStake';

export const PERPS_PROGRAM_ID = new Address('PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu');
export const PERPS_PROGRAM_ADDRESS = PERPS_PROGRAM_ID;

export interface PerpsProgram {
    name: 'perps';
    programId: Address;
}

export function getPerpsProgram(programId: Address = PERPS_PROGRAM_ID): PerpsProgram {
    return { name: 'perps', programId };
}

export enum PerpsAccount {
    BorrowPosition,
    Custody,
    Perpetuals,
    Pool,
    PositionRequest,
    Position,
    StakeInfo,
    TokenLedger,
}

export function identifyPerpsAccount(account: { data: Uint8Array } | Uint8Array): PerpsAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (BORROW_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsAccount.BorrowPosition;
    if (CUSTODY_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PerpsAccount.Custody;
    if (PERPETUALS_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsAccount.Perpetuals;
    if (POOL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PerpsAccount.Pool;
    if (POSITION_REQUEST_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsAccount.PositionRequest;
    if (POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PerpsAccount.Position;
    if (STAKE_INFO_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsAccount.StakeInfo;
    if (TOKEN_LEDGER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsAccount.TokenLedger;
    throw new Error('Failed to identify Perps account');
}

export enum PerpsInstruction {
    Init,
    AddPool,
    AddCustody,
    SetCustodyConfig,
    SetPoolConfig,
    SetPerpetualsConfig,
    TransferAdmin,
    WithdrawFees2,
    CreateTokenMetadata,
    CreateTokenLedger,
    ReallocCustody,
    ReallocPool,
    CreateAndDelegateStakeAccount,
    Unstake,
    WithdrawStake,
    RedeemStake,
    OperatorSetCustodyConfig,
    OperatorSetPoolConfig,
    TestInit,
    SetTestTime,
    SetTokenLedger,
    Swap2,
    SwapWithTokenLedger,
    InstantIncreasePositionPreSwap,
    AddLiquidity2,
    RemoveLiquidity2,
    CreateIncreasePositionMarketRequest,
    CreateDecreasePositionRequest2,
    CreateDecreasePositionMarketRequest,
    UpdateDecreasePositionRequest2,
    ClosePositionRequest2,
    ClosePositionRequest3,
    IncreasePosition4,
    IncreasePositionPreSwap,
    IncreasePositionWithInternalSwap,
    DecreasePosition4,
    DecreasePositionWithInternalSwap,
    DecreasePositionWithTpsl,
    DecreasePositionWithTpslAndInternalSwap,
    LiquidateFullPosition4,
    RefreshAssetsUnderManagement,
    SetMaxGlobalSizes,
    InstantCreateTpsl,
    InstantCreateLimitOrder,
    InstantIncreasePosition,
    InstantDecreasePosition,
    InstantDecreasePosition2,
    InstantUpdateLimitOrder,
    InstantUpdateTpsl,
    GetAddLiquidityAmountAndFee2,
    GetRemoveLiquidityAmountAndFee2,
    GetAssetsUnderManagement2,
    BorrowFromCustody,
    RepayToCustody,
    DepositCollateralForBorrows,
    WithdrawCollateralForBorrows,
    LiquidateBorrowPosition,
    PartialLiquidateBorrowPosition,
    CloseBorrowPosition,
}

export function identifyPerpsInstruction(instruction: { data: Uint8Array } | Uint8Array): PerpsInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PerpsInstruction.Init;
    if (ADD_POOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.AddPool;
    if (ADD_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.AddCustody;
    if (SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SetCustodyConfig;
    if (SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SetPoolConfig;
    if (SET_PERPETUALS_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SetPerpetualsConfig;
    if (TRANSFER_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.TransferAdmin;
    if (WITHDRAW_FEES2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.WithdrawFees2;
    if (CREATE_TOKEN_METADATA_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.CreateTokenMetadata;
    if (CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.CreateTokenLedger;
    if (REALLOC_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.ReallocCustody;
    if (REALLOC_POOL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.ReallocPool;
    if (CREATE_AND_DELEGATE_STAKE_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.CreateAndDelegateStakeAccount;
    if (UNSTAKE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.Unstake;
    if (WITHDRAW_STAKE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.WithdrawStake;
    if (REDEEM_STAKE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.RedeemStake;
    if (OPERATOR_SET_CUSTODY_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.OperatorSetCustodyConfig;
    if (OPERATOR_SET_POOL_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.OperatorSetPoolConfig;
    if (TEST_INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.TestInit;
    if (SET_TEST_TIME_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SetTestTime;
    if (SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SetTokenLedger;
    if (SWAP2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PerpsInstruction.Swap2;
    if (SWAP_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SwapWithTokenLedger;
    if (INSTANT_INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantIncreasePositionPreSwap;
    if (ADD_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.AddLiquidity2;
    if (REMOVE_LIQUIDITY2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.RemoveLiquidity2;
    if (
        CREATE_INCREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return PerpsInstruction.CreateIncreasePositionMarketRequest;
    if (CREATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.CreateDecreasePositionRequest2;
    if (
        CREATE_DECREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return PerpsInstruction.CreateDecreasePositionMarketRequest;
    if (UPDATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.UpdateDecreasePositionRequest2;
    if (CLOSE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.ClosePositionRequest2;
    if (CLOSE_POSITION_REQUEST3_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.ClosePositionRequest3;
    if (INCREASE_POSITION4_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.IncreasePosition4;
    if (INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.IncreasePositionPreSwap;
    if (INCREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.IncreasePositionWithInternalSwap;
    if (DECREASE_POSITION4_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.DecreasePosition4;
    if (DECREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.DecreasePositionWithInternalSwap;
    if (DECREASE_POSITION_WITH_TPSL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.DecreasePositionWithTpsl;
    if (
        DECREASE_POSITION_WITH_TPSL_AND_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return PerpsInstruction.DecreasePositionWithTpslAndInternalSwap;
    if (LIQUIDATE_FULL_POSITION4_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.LiquidateFullPosition4;
    if (REFRESH_ASSETS_UNDER_MANAGEMENT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.RefreshAssetsUnderManagement;
    if (SET_MAX_GLOBAL_SIZES_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.SetMaxGlobalSizes;
    if (INSTANT_CREATE_TPSL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantCreateTpsl;
    if (INSTANT_CREATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantCreateLimitOrder;
    if (INSTANT_INCREASE_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantIncreasePosition;
    if (INSTANT_DECREASE_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantDecreasePosition;
    if (INSTANT_DECREASE_POSITION2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantDecreasePosition2;
    if (INSTANT_UPDATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantUpdateLimitOrder;
    if (INSTANT_UPDATE_TPSL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.InstantUpdateTpsl;
    if (GET_ADD_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.GetAddLiquidityAmountAndFee2;
    if (GET_REMOVE_LIQUIDITY_AMOUNT_AND_FEE2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.GetRemoveLiquidityAmountAndFee2;
    if (GET_ASSETS_UNDER_MANAGEMENT2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.GetAssetsUnderManagement2;
    if (BORROW_FROM_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.BorrowFromCustody;
    if (REPAY_TO_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.RepayToCustody;
    if (DEPOSIT_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.DepositCollateralForBorrows;
    if (WITHDRAW_COLLATERAL_FOR_BORROWS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.WithdrawCollateralForBorrows;
    if (LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.LiquidateBorrowPosition;
    if (PARTIAL_LIQUIDATE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.PartialLiquidateBorrowPosition;
    if (CLOSE_BORROW_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PerpsInstruction.CloseBorrowPosition;
    throw new Error('Failed to identify Perps instruction');
}

export type ParsedPerpsInstruction =
    | ({ instructionType: PerpsInstruction.Init } & ParsedInitInstruction)
    | ({ instructionType: PerpsInstruction.AddPool } & ParsedAddPoolInstruction)
    | ({ instructionType: PerpsInstruction.AddCustody } & ParsedAddCustodyInstruction)
    | ({ instructionType: PerpsInstruction.SetCustodyConfig } & ParsedSetCustodyConfigInstruction)
    | ({ instructionType: PerpsInstruction.SetPoolConfig } & ParsedSetPoolConfigInstruction)
    | ({ instructionType: PerpsInstruction.SetPerpetualsConfig } & ParsedSetPerpetualsConfigInstruction)
    | ({ instructionType: PerpsInstruction.TransferAdmin } & ParsedTransferAdminInstruction)
    | ({ instructionType: PerpsInstruction.WithdrawFees2 } & ParsedWithdrawFees2Instruction)
    | ({ instructionType: PerpsInstruction.CreateTokenMetadata } & ParsedCreateTokenMetadataInstruction)
    | ({ instructionType: PerpsInstruction.CreateTokenLedger } & ParsedCreateTokenLedgerInstruction)
    | ({ instructionType: PerpsInstruction.ReallocCustody } & ParsedReallocCustodyInstruction)
    | ({ instructionType: PerpsInstruction.ReallocPool } & ParsedReallocPoolInstruction)
    | ({
          instructionType: PerpsInstruction.CreateAndDelegateStakeAccount;
      } & ParsedCreateAndDelegateStakeAccountInstruction)
    | ({ instructionType: PerpsInstruction.Unstake } & ParsedUnstakeInstruction)
    | ({ instructionType: PerpsInstruction.WithdrawStake } & ParsedWithdrawStakeInstruction)
    | ({ instructionType: PerpsInstruction.RedeemStake } & ParsedRedeemStakeInstruction)
    | ({ instructionType: PerpsInstruction.OperatorSetCustodyConfig } & ParsedOperatorSetCustodyConfigInstruction)
    | ({ instructionType: PerpsInstruction.OperatorSetPoolConfig } & ParsedOperatorSetPoolConfigInstruction)
    | ({ instructionType: PerpsInstruction.TestInit } & ParsedTestInitInstruction)
    | ({ instructionType: PerpsInstruction.SetTestTime } & ParsedSetTestTimeInstruction)
    | ({ instructionType: PerpsInstruction.SetTokenLedger } & ParsedSetTokenLedgerInstruction)
    | ({ instructionType: PerpsInstruction.Swap2 } & ParsedSwap2Instruction)
    | ({ instructionType: PerpsInstruction.SwapWithTokenLedger } & ParsedSwapWithTokenLedgerInstruction)
    | ({
          instructionType: PerpsInstruction.InstantIncreasePositionPreSwap;
      } & ParsedInstantIncreasePositionPreSwapInstruction)
    | ({ instructionType: PerpsInstruction.AddLiquidity2 } & ParsedAddLiquidity2Instruction)
    | ({ instructionType: PerpsInstruction.RemoveLiquidity2 } & ParsedRemoveLiquidity2Instruction)
    | ({
          instructionType: PerpsInstruction.CreateIncreasePositionMarketRequest;
      } & ParsedCreateIncreasePositionMarketRequestInstruction)
    | ({
          instructionType: PerpsInstruction.CreateDecreasePositionRequest2;
      } & ParsedCreateDecreasePositionRequest2Instruction)
    | ({
          instructionType: PerpsInstruction.CreateDecreasePositionMarketRequest;
      } & ParsedCreateDecreasePositionMarketRequestInstruction)
    | ({
          instructionType: PerpsInstruction.UpdateDecreasePositionRequest2;
      } & ParsedUpdateDecreasePositionRequest2Instruction)
    | ({ instructionType: PerpsInstruction.ClosePositionRequest2 } & ParsedClosePositionRequest2Instruction)
    | ({ instructionType: PerpsInstruction.ClosePositionRequest3 } & ParsedClosePositionRequest3Instruction)
    | ({ instructionType: PerpsInstruction.IncreasePosition4 } & ParsedIncreasePosition4Instruction)
    | ({ instructionType: PerpsInstruction.IncreasePositionPreSwap } & ParsedIncreasePositionPreSwapInstruction)
    | ({
          instructionType: PerpsInstruction.IncreasePositionWithInternalSwap;
      } & ParsedIncreasePositionWithInternalSwapInstruction)
    | ({ instructionType: PerpsInstruction.DecreasePosition4 } & ParsedDecreasePosition4Instruction)
    | ({
          instructionType: PerpsInstruction.DecreasePositionWithInternalSwap;
      } & ParsedDecreasePositionWithInternalSwapInstruction)
    | ({ instructionType: PerpsInstruction.DecreasePositionWithTpsl } & ParsedDecreasePositionWithTpslInstruction)
    | ({
          instructionType: PerpsInstruction.DecreasePositionWithTpslAndInternalSwap;
      } & ParsedDecreasePositionWithTpslAndInternalSwapInstruction)
    | ({ instructionType: PerpsInstruction.LiquidateFullPosition4 } & ParsedLiquidateFullPosition4Instruction)
    | ({
          instructionType: PerpsInstruction.RefreshAssetsUnderManagement;
      } & ParsedRefreshAssetsUnderManagementInstruction)
    | ({ instructionType: PerpsInstruction.SetMaxGlobalSizes } & ParsedSetMaxGlobalSizesInstruction)
    | ({ instructionType: PerpsInstruction.InstantCreateTpsl } & ParsedInstantCreateTpslInstruction)
    | ({ instructionType: PerpsInstruction.InstantCreateLimitOrder } & ParsedInstantCreateLimitOrderInstruction)
    | ({ instructionType: PerpsInstruction.InstantIncreasePosition } & ParsedInstantIncreasePositionInstruction)
    | ({ instructionType: PerpsInstruction.InstantDecreasePosition } & ParsedInstantDecreasePositionInstruction)
    | ({ instructionType: PerpsInstruction.InstantDecreasePosition2 } & ParsedInstantDecreasePosition2Instruction)
    | ({ instructionType: PerpsInstruction.InstantUpdateLimitOrder } & ParsedInstantUpdateLimitOrderInstruction)
    | ({ instructionType: PerpsInstruction.InstantUpdateTpsl } & ParsedInstantUpdateTpslInstruction)
    | ({
          instructionType: PerpsInstruction.GetAddLiquidityAmountAndFee2;
      } & ParsedGetAddLiquidityAmountAndFee2Instruction)
    | ({
          instructionType: PerpsInstruction.GetRemoveLiquidityAmountAndFee2;
      } & ParsedGetRemoveLiquidityAmountAndFee2Instruction)
    | ({ instructionType: PerpsInstruction.GetAssetsUnderManagement2 } & ParsedGetAssetsUnderManagement2Instruction)
    | ({ instructionType: PerpsInstruction.BorrowFromCustody } & ParsedBorrowFromCustodyInstruction)
    | ({ instructionType: PerpsInstruction.RepayToCustody } & ParsedRepayToCustodyInstruction)
    | ({ instructionType: PerpsInstruction.DepositCollateralForBorrows } & ParsedDepositCollateralForBorrowsInstruction)
    | ({
          instructionType: PerpsInstruction.WithdrawCollateralForBorrows;
      } & ParsedWithdrawCollateralForBorrowsInstruction)
    | ({ instructionType: PerpsInstruction.LiquidateBorrowPosition } & ParsedLiquidateBorrowPositionInstruction)
    | ({
          instructionType: PerpsInstruction.PartialLiquidateBorrowPosition;
      } & ParsedPartialLiquidateBorrowPositionInstruction)
    | ({ instructionType: PerpsInstruction.CloseBorrowPosition } & ParsedCloseBorrowPositionInstruction);

export function parsePerpsInstruction(instruction: TransactionInstruction): ParsedPerpsInstruction {
    const instructionType = identifyPerpsInstruction(instruction);
    switch (instructionType) {
        case PerpsInstruction.Init:
            return {
                instructionType,
                ...parseInitInstruction(instruction),
            };
        case PerpsInstruction.AddPool:
            return {
                instructionType,
                ...parseAddPoolInstruction(instruction),
            };
        case PerpsInstruction.AddCustody:
            return {
                instructionType,
                ...parseAddCustodyInstruction(instruction),
            };
        case PerpsInstruction.SetCustodyConfig:
            return {
                instructionType,
                ...parseSetCustodyConfigInstruction(instruction),
            };
        case PerpsInstruction.SetPoolConfig:
            return {
                instructionType,
                ...parseSetPoolConfigInstruction(instruction),
            };
        case PerpsInstruction.SetPerpetualsConfig:
            return {
                instructionType,
                ...parseSetPerpetualsConfigInstruction(instruction),
            };
        case PerpsInstruction.TransferAdmin:
            return {
                instructionType,
                ...parseTransferAdminInstruction(instruction),
            };
        case PerpsInstruction.WithdrawFees2:
            return {
                instructionType,
                ...parseWithdrawFees2Instruction(instruction),
            };
        case PerpsInstruction.CreateTokenMetadata:
            return {
                instructionType,
                ...parseCreateTokenMetadataInstruction(instruction),
            };
        case PerpsInstruction.CreateTokenLedger:
            return {
                instructionType,
                ...parseCreateTokenLedgerInstruction(instruction),
            };
        case PerpsInstruction.ReallocCustody:
            return {
                instructionType,
                ...parseReallocCustodyInstruction(instruction),
            };
        case PerpsInstruction.ReallocPool:
            return {
                instructionType,
                ...parseReallocPoolInstruction(instruction),
            };
        case PerpsInstruction.CreateAndDelegateStakeAccount:
            return {
                instructionType,
                ...parseCreateAndDelegateStakeAccountInstruction(instruction),
            };
        case PerpsInstruction.Unstake:
            return {
                instructionType,
                ...parseUnstakeInstruction(instruction),
            };
        case PerpsInstruction.WithdrawStake:
            return {
                instructionType,
                ...parseWithdrawStakeInstruction(instruction),
            };
        case PerpsInstruction.RedeemStake:
            return {
                instructionType,
                ...parseRedeemStakeInstruction(instruction),
            };
        case PerpsInstruction.OperatorSetCustodyConfig:
            return {
                instructionType,
                ...parseOperatorSetCustodyConfigInstruction(instruction),
            };
        case PerpsInstruction.OperatorSetPoolConfig:
            return {
                instructionType,
                ...parseOperatorSetPoolConfigInstruction(instruction),
            };
        case PerpsInstruction.TestInit:
            return {
                instructionType,
                ...parseTestInitInstruction(instruction),
            };
        case PerpsInstruction.SetTestTime:
            return {
                instructionType,
                ...parseSetTestTimeInstruction(instruction),
            };
        case PerpsInstruction.SetTokenLedger:
            return {
                instructionType,
                ...parseSetTokenLedgerInstruction(instruction),
            };
        case PerpsInstruction.Swap2:
            return {
                instructionType,
                ...parseSwap2Instruction(instruction),
            };
        case PerpsInstruction.SwapWithTokenLedger:
            return {
                instructionType,
                ...parseSwapWithTokenLedgerInstruction(instruction),
            };
        case PerpsInstruction.InstantIncreasePositionPreSwap:
            return {
                instructionType,
                ...parseInstantIncreasePositionPreSwapInstruction(instruction),
            };
        case PerpsInstruction.AddLiquidity2:
            return {
                instructionType,
                ...parseAddLiquidity2Instruction(instruction),
            };
        case PerpsInstruction.RemoveLiquidity2:
            return {
                instructionType,
                ...parseRemoveLiquidity2Instruction(instruction),
            };
        case PerpsInstruction.CreateIncreasePositionMarketRequest:
            return {
                instructionType,
                ...parseCreateIncreasePositionMarketRequestInstruction(instruction),
            };
        case PerpsInstruction.CreateDecreasePositionRequest2:
            return {
                instructionType,
                ...parseCreateDecreasePositionRequest2Instruction(instruction),
            };
        case PerpsInstruction.CreateDecreasePositionMarketRequest:
            return {
                instructionType,
                ...parseCreateDecreasePositionMarketRequestInstruction(instruction),
            };
        case PerpsInstruction.UpdateDecreasePositionRequest2:
            return {
                instructionType,
                ...parseUpdateDecreasePositionRequest2Instruction(instruction),
            };
        case PerpsInstruction.ClosePositionRequest2:
            return {
                instructionType,
                ...parseClosePositionRequest2Instruction(instruction),
            };
        case PerpsInstruction.ClosePositionRequest3:
            return {
                instructionType,
                ...parseClosePositionRequest3Instruction(instruction),
            };
        case PerpsInstruction.IncreasePosition4:
            return {
                instructionType,
                ...parseIncreasePosition4Instruction(instruction),
            };
        case PerpsInstruction.IncreasePositionPreSwap:
            return {
                instructionType,
                ...parseIncreasePositionPreSwapInstruction(instruction),
            };
        case PerpsInstruction.IncreasePositionWithInternalSwap:
            return {
                instructionType,
                ...parseIncreasePositionWithInternalSwapInstruction(instruction),
            };
        case PerpsInstruction.DecreasePosition4:
            return {
                instructionType,
                ...parseDecreasePosition4Instruction(instruction),
            };
        case PerpsInstruction.DecreasePositionWithInternalSwap:
            return {
                instructionType,
                ...parseDecreasePositionWithInternalSwapInstruction(instruction),
            };
        case PerpsInstruction.DecreasePositionWithTpsl:
            return {
                instructionType,
                ...parseDecreasePositionWithTpslInstruction(instruction),
            };
        case PerpsInstruction.DecreasePositionWithTpslAndInternalSwap:
            return {
                instructionType,
                ...parseDecreasePositionWithTpslAndInternalSwapInstruction(instruction),
            };
        case PerpsInstruction.LiquidateFullPosition4:
            return {
                instructionType,
                ...parseLiquidateFullPosition4Instruction(instruction),
            };
        case PerpsInstruction.RefreshAssetsUnderManagement:
            return {
                instructionType,
                ...parseRefreshAssetsUnderManagementInstruction(instruction),
            };
        case PerpsInstruction.SetMaxGlobalSizes:
            return {
                instructionType,
                ...parseSetMaxGlobalSizesInstruction(instruction),
            };
        case PerpsInstruction.InstantCreateTpsl:
            return {
                instructionType,
                ...parseInstantCreateTpslInstruction(instruction),
            };
        case PerpsInstruction.InstantCreateLimitOrder:
            return {
                instructionType,
                ...parseInstantCreateLimitOrderInstruction(instruction),
            };
        case PerpsInstruction.InstantIncreasePosition:
            return {
                instructionType,
                ...parseInstantIncreasePositionInstruction(instruction),
            };
        case PerpsInstruction.InstantDecreasePosition:
            return {
                instructionType,
                ...parseInstantDecreasePositionInstruction(instruction),
            };
        case PerpsInstruction.InstantDecreasePosition2:
            return {
                instructionType,
                ...parseInstantDecreasePosition2Instruction(instruction),
            };
        case PerpsInstruction.InstantUpdateLimitOrder:
            return {
                instructionType,
                ...parseInstantUpdateLimitOrderInstruction(instruction),
            };
        case PerpsInstruction.InstantUpdateTpsl:
            return {
                instructionType,
                ...parseInstantUpdateTpslInstruction(instruction),
            };
        case PerpsInstruction.GetAddLiquidityAmountAndFee2:
            return {
                instructionType,
                ...parseGetAddLiquidityAmountAndFee2Instruction(instruction),
            };
        case PerpsInstruction.GetRemoveLiquidityAmountAndFee2:
            return {
                instructionType,
                ...parseGetRemoveLiquidityAmountAndFee2Instruction(instruction),
            };
        case PerpsInstruction.GetAssetsUnderManagement2:
            return {
                instructionType,
                ...parseGetAssetsUnderManagement2Instruction(instruction),
            };
        case PerpsInstruction.BorrowFromCustody:
            return {
                instructionType,
                ...parseBorrowFromCustodyInstruction(instruction),
            };
        case PerpsInstruction.RepayToCustody:
            return {
                instructionType,
                ...parseRepayToCustodyInstruction(instruction),
            };
        case PerpsInstruction.DepositCollateralForBorrows:
            return {
                instructionType,
                ...parseDepositCollateralForBorrowsInstruction(instruction),
            };
        case PerpsInstruction.WithdrawCollateralForBorrows:
            return {
                instructionType,
                ...parseWithdrawCollateralForBorrowsInstruction(instruction),
            };
        case PerpsInstruction.LiquidateBorrowPosition:
            return {
                instructionType,
                ...parseLiquidateBorrowPositionInstruction(instruction),
            };
        case PerpsInstruction.PartialLiquidateBorrowPosition:
            return {
                instructionType,
                ...parsePartialLiquidateBorrowPositionInstruction(instruction),
            };
        case PerpsInstruction.CloseBorrowPosition:
            return {
                instructionType,
                ...parseCloseBorrowPositionInstruction(instruction),
            };
    }
}
