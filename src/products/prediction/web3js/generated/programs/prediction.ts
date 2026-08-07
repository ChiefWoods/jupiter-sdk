import {
    ACCEPT_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseAcceptTicketInstruction,
    type ParsedAcceptTicketInstruction,
} from '../instructions/acceptTicket';
import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CANCEL_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseCancelOrderInstruction,
    type ParsedCancelOrderInstruction,
} from '../instructions/cancelOrder';
import {
    CLAIM_PAYOUT2_INSTRUCTION_DISCRIMINATOR,
    parseClaimPayout2Instruction,
    type ParsedClaimPayout2Instruction,
} from '../instructions/claimPayout2';
import {
    CLAIM_PAYOUT_INSTRUCTION_DISCRIMINATOR,
    parseClaimPayoutInstruction,
    type ParsedClaimPayoutInstruction,
} from '../instructions/claimPayout';
import {
    CLAIM_REFUND_INSTRUCTION_DISCRIMINATOR,
    parseClaimRefundInstruction,
    type ParsedClaimRefundInstruction,
} from '../instructions/claimRefund';
import {
    CLAIM_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseClaimTicketInstruction,
    type ParsedClaimTicketInstruction,
} from '../instructions/claimTicket';
import {
    CLOSE_LOST_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseCloseLostPositionInstruction,
    type ParsedCloseLostPositionInstruction,
} from '../instructions/closeLostPosition';
import {
    CLOSE_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseCloseOrderInstruction,
    type ParsedCloseOrderInstruction,
} from '../instructions/closeOrder';
import {
    CLOSE_POSITION_INSTRUCTION_DISCRIMINATOR,
    parseClosePositionInstruction,
    type ParsedClosePositionInstruction,
} from '../instructions/closePosition';
import {
    CLOSE_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseCloseTicketInstruction,
    type ParsedCloseTicketInstruction,
} from '../instructions/closeTicket';
import {
    CREATE_MARKET_RESULT_INSTRUCTION_DISCRIMINATOR,
    parseCreateMarketResultInstruction,
    type ParsedCreateMarketResultInstruction,
} from '../instructions/createMarketResult';
import {
    CREATE_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseCreateOrderInstruction,
    type ParsedCreateOrderInstruction,
} from '../instructions/createOrder';
import {
    CREATE_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseCreateTicketInstruction,
    type ParsedCreateTicketInstruction,
} from '../instructions/createTicket';
import {
    DISABLE_DEPOSITS_INSTRUCTION_DISCRIMINATOR,
    parseDisableDepositsInstruction,
    type ParsedDisableDepositsInstruction,
} from '../instructions/disableDeposits';
import {
    DISABLE_WITHDRAWALS_INSTRUCTION_DISCRIMINATOR,
    parseDisableWithdrawalsInstruction,
    type ParsedDisableWithdrawalsInstruction,
} from '../instructions/disableWithdrawals';
import {
    FILL_BUY_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseFillBuyOrderInstruction,
    type ParsedFillBuyOrderInstruction,
} from '../instructions/fillBuyOrder';
import {
    FILL_SELL_ORDER_INSTRUCTION_DISCRIMINATOR,
    parseFillSellOrderInstruction,
    type ParsedFillSellOrderInstruction,
} from '../instructions/fillSellOrder';
import {
    INITIALIZE_VAULT_INSTRUCTION_DISCRIMINATOR,
    parseInitializeVaultInstruction,
    type ParsedInitializeVaultInstruction,
} from '../instructions/initializeVault';
import { MARKET_RESULT_ACCOUNT_DISCRIMINATOR } from '../accounts/marketResult';
import {
    MIGRATE_POSITION_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR,
    parseMigratePositionContractUnitsInstruction,
    type ParsedMigratePositionContractUnitsInstruction,
} from '../instructions/migratePositionContractUnits';
import {
    MIGRATE_VAULT_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR,
    parseMigrateVaultContractUnitsInstruction,
    type ParsedMigrateVaultContractUnitsInstruction,
} from '../instructions/migrateVaultContractUnits';
import { ORDER_ACCOUNT_DISCRIMINATOR } from '../accounts/order';
import { POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/position';
import {
    REFUND_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseRefundTicketInstruction,
    type ParsedRefundTicketInstruction,
} from '../instructions/refundTicket';
import {
    REJECT_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseRejectTicketInstruction,
    type ParsedRejectTicketInstruction,
} from '../instructions/rejectTicket';
import {
    SETTLE_TICKET_INSTRUCTION_DISCRIMINATOR,
    parseSettleTicketInstruction,
    type ParsedSettleTicketInstruction,
} from '../instructions/settleTicket';
import {
    SET_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseSetVaultConfigInstruction,
    type ParsedSetVaultConfigInstruction,
} from '../instructions/setVaultConfig';
import { TICKET_ACCOUNT_DISCRIMINATOR } from '../accounts/ticket';
import { VAULT_ACCOUNT_DISCRIMINATOR } from '../accounts/vault';
import {
    WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawInstruction,
    type ParsedWithdrawInstruction,
} from '../instructions/withdraw';

export const PREDICTION_PROGRAM_ID = new Address('3ZZuTbwC6aJbvteyVxXUS7gtFYdf7AuXeitx6VyvjvUp');
export const PREDICTION_PROGRAM_ADDRESS = PREDICTION_PROGRAM_ID;

export interface PredictionProgram {
    name: 'prediction';
    programId: Address;
}

export function getPredictionProgram(programId: Address = PREDICTION_PROGRAM_ID): PredictionProgram {
    return { name: 'prediction', programId };
}

export enum PredictionAccount {
    MarketResult,
    Order,
    Position,
    Ticket,
    Vault,
}

export function identifyPredictionAccount(account: { data: Uint8Array } | Uint8Array): PredictionAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (MARKET_RESULT_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionAccount.MarketResult;
    if (ORDER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PredictionAccount.Order;
    if (POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionAccount.Position;
    if (TICKET_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PredictionAccount.Ticket;
    if (VAULT_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return PredictionAccount.Vault;
    throw new Error('Failed to identify Prediction account');
}

export enum PredictionInstruction {
    AcceptTicket,
    CancelOrder,
    ClaimPayout,
    ClaimPayout2,
    ClaimRefund,
    ClaimTicket,
    CloseLostPosition,
    CloseOrder,
    ClosePosition,
    CloseTicket,
    CreateMarketResult,
    CreateOrder,
    CreateTicket,
    DisableDeposits,
    DisableWithdrawals,
    FillBuyOrder,
    FillSellOrder,
    InitializeVault,
    MigratePositionContractUnits,
    MigrateVaultContractUnits,
    RefundTicket,
    RejectTicket,
    SetVaultConfig,
    SettleTicket,
    Withdraw,
}

export function identifyPredictionInstruction(instruction: { data: Uint8Array } | Uint8Array): PredictionInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (ACCEPT_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.AcceptTicket;
    if (CANCEL_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CancelOrder;
    if (CLAIM_PAYOUT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.ClaimPayout;
    if (CLAIM_PAYOUT2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.ClaimPayout2;
    if (CLAIM_REFUND_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.ClaimRefund;
    if (CLAIM_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.ClaimTicket;
    if (CLOSE_LOST_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CloseLostPosition;
    if (CLOSE_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CloseOrder;
    if (CLOSE_POSITION_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.ClosePosition;
    if (CLOSE_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CloseTicket;
    if (CREATE_MARKET_RESULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CreateMarketResult;
    if (CREATE_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CreateOrder;
    if (CREATE_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.CreateTicket;
    if (DISABLE_DEPOSITS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.DisableDeposits;
    if (DISABLE_WITHDRAWALS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.DisableWithdrawals;
    if (FILL_BUY_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.FillBuyOrder;
    if (FILL_SELL_ORDER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.FillSellOrder;
    if (INITIALIZE_VAULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.InitializeVault;
    if (MIGRATE_POSITION_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.MigratePositionContractUnits;
    if (MIGRATE_VAULT_CONTRACT_UNITS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.MigrateVaultContractUnits;
    if (REFUND_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.RefundTicket;
    if (REJECT_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.RejectTicket;
    if (SET_VAULT_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.SetVaultConfig;
    if (SETTLE_TICKET_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.SettleTicket;
    if (WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return PredictionInstruction.Withdraw;
    throw new Error('Failed to identify Prediction instruction');
}

export type ParsedPredictionInstruction =
    | ({ instructionType: PredictionInstruction.AcceptTicket } & ParsedAcceptTicketInstruction)
    | ({ instructionType: PredictionInstruction.CancelOrder } & ParsedCancelOrderInstruction)
    | ({ instructionType: PredictionInstruction.ClaimPayout } & ParsedClaimPayoutInstruction)
    | ({ instructionType: PredictionInstruction.ClaimPayout2 } & ParsedClaimPayout2Instruction)
    | ({ instructionType: PredictionInstruction.ClaimRefund } & ParsedClaimRefundInstruction)
    | ({ instructionType: PredictionInstruction.ClaimTicket } & ParsedClaimTicketInstruction)
    | ({ instructionType: PredictionInstruction.CloseLostPosition } & ParsedCloseLostPositionInstruction)
    | ({ instructionType: PredictionInstruction.CloseOrder } & ParsedCloseOrderInstruction)
    | ({ instructionType: PredictionInstruction.ClosePosition } & ParsedClosePositionInstruction)
    | ({ instructionType: PredictionInstruction.CloseTicket } & ParsedCloseTicketInstruction)
    | ({ instructionType: PredictionInstruction.CreateMarketResult } & ParsedCreateMarketResultInstruction)
    | ({ instructionType: PredictionInstruction.CreateOrder } & ParsedCreateOrderInstruction)
    | ({ instructionType: PredictionInstruction.CreateTicket } & ParsedCreateTicketInstruction)
    | ({ instructionType: PredictionInstruction.DisableDeposits } & ParsedDisableDepositsInstruction)
    | ({ instructionType: PredictionInstruction.DisableWithdrawals } & ParsedDisableWithdrawalsInstruction)
    | ({ instructionType: PredictionInstruction.FillBuyOrder } & ParsedFillBuyOrderInstruction)
    | ({ instructionType: PredictionInstruction.FillSellOrder } & ParsedFillSellOrderInstruction)
    | ({ instructionType: PredictionInstruction.InitializeVault } & ParsedInitializeVaultInstruction)
    | ({
          instructionType: PredictionInstruction.MigratePositionContractUnits;
      } & ParsedMigratePositionContractUnitsInstruction)
    | ({
          instructionType: PredictionInstruction.MigrateVaultContractUnits;
      } & ParsedMigrateVaultContractUnitsInstruction)
    | ({ instructionType: PredictionInstruction.RefundTicket } & ParsedRefundTicketInstruction)
    | ({ instructionType: PredictionInstruction.RejectTicket } & ParsedRejectTicketInstruction)
    | ({ instructionType: PredictionInstruction.SetVaultConfig } & ParsedSetVaultConfigInstruction)
    | ({ instructionType: PredictionInstruction.SettleTicket } & ParsedSettleTicketInstruction)
    | ({ instructionType: PredictionInstruction.Withdraw } & ParsedWithdrawInstruction);

export function parsePredictionInstruction(instruction: TransactionInstruction): ParsedPredictionInstruction {
    const instructionType = identifyPredictionInstruction(instruction);
    switch (instructionType) {
        case PredictionInstruction.AcceptTicket:
            return {
                instructionType,
                ...parseAcceptTicketInstruction(instruction),
            };
        case PredictionInstruction.CancelOrder:
            return {
                instructionType,
                ...parseCancelOrderInstruction(instruction),
            };
        case PredictionInstruction.ClaimPayout:
            return {
                instructionType,
                ...parseClaimPayoutInstruction(instruction),
            };
        case PredictionInstruction.ClaimPayout2:
            return {
                instructionType,
                ...parseClaimPayout2Instruction(instruction),
            };
        case PredictionInstruction.ClaimRefund:
            return {
                instructionType,
                ...parseClaimRefundInstruction(instruction),
            };
        case PredictionInstruction.ClaimTicket:
            return {
                instructionType,
                ...parseClaimTicketInstruction(instruction),
            };
        case PredictionInstruction.CloseLostPosition:
            return {
                instructionType,
                ...parseCloseLostPositionInstruction(instruction),
            };
        case PredictionInstruction.CloseOrder:
            return {
                instructionType,
                ...parseCloseOrderInstruction(instruction),
            };
        case PredictionInstruction.ClosePosition:
            return {
                instructionType,
                ...parseClosePositionInstruction(instruction),
            };
        case PredictionInstruction.CloseTicket:
            return {
                instructionType,
                ...parseCloseTicketInstruction(instruction),
            };
        case PredictionInstruction.CreateMarketResult:
            return {
                instructionType,
                ...parseCreateMarketResultInstruction(instruction),
            };
        case PredictionInstruction.CreateOrder:
            return {
                instructionType,
                ...parseCreateOrderInstruction(instruction),
            };
        case PredictionInstruction.CreateTicket:
            return {
                instructionType,
                ...parseCreateTicketInstruction(instruction),
            };
        case PredictionInstruction.DisableDeposits:
            return {
                instructionType,
                ...parseDisableDepositsInstruction(instruction),
            };
        case PredictionInstruction.DisableWithdrawals:
            return {
                instructionType,
                ...parseDisableWithdrawalsInstruction(instruction),
            };
        case PredictionInstruction.FillBuyOrder:
            return {
                instructionType,
                ...parseFillBuyOrderInstruction(instruction),
            };
        case PredictionInstruction.FillSellOrder:
            return {
                instructionType,
                ...parseFillSellOrderInstruction(instruction),
            };
        case PredictionInstruction.InitializeVault:
            return {
                instructionType,
                ...parseInitializeVaultInstruction(instruction),
            };
        case PredictionInstruction.MigratePositionContractUnits:
            return {
                instructionType,
                ...parseMigratePositionContractUnitsInstruction(instruction),
            };
        case PredictionInstruction.MigrateVaultContractUnits:
            return {
                instructionType,
                ...parseMigrateVaultContractUnitsInstruction(instruction),
            };
        case PredictionInstruction.RefundTicket:
            return {
                instructionType,
                ...parseRefundTicketInstruction(instruction),
            };
        case PredictionInstruction.RejectTicket:
            return {
                instructionType,
                ...parseRejectTicketInstruction(instruction),
            };
        case PredictionInstruction.SetVaultConfig:
            return {
                instructionType,
                ...parseSetVaultConfigInstruction(instruction),
            };
        case PredictionInstruction.SettleTicket:
            return {
                instructionType,
                ...parseSettleTicketInstruction(instruction),
            };
        case PredictionInstruction.Withdraw:
            return {
                instructionType,
                ...parseWithdrawInstruction(instruction),
            };
    }
}
