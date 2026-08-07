import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    DEPOSIT_INSTRUCTION_DISCRIMINATOR,
    parseDepositInstruction,
    type ParsedDepositInstruction,
} from '../instructions/deposit';
import {
    DEPOSIT_WITH_MIN_AMOUNT_OUT_INSTRUCTION_DISCRIMINATOR,
    parseDepositWithMinAmountOutInstruction,
    type ParsedDepositWithMinAmountOutInstruction,
} from '../instructions/depositWithMinAmountOut';
import {
    INIT_LENDING_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseInitLendingAdminInstruction,
    type ParsedInitLendingAdminInstruction,
} from '../instructions/initLendingAdmin';
import {
    INIT_LENDING_INSTRUCTION_DISCRIMINATOR,
    parseInitLendingInstruction,
    type ParsedInitLendingInstruction,
} from '../instructions/initLending';
import { LENDING_ACCOUNT_DISCRIMINATOR } from '../accounts/lending';
import { LENDING_ADMIN_ACCOUNT_DISCRIMINATOR } from '../accounts/lendingAdmin';
import { LENDING_REWARDS_RATE_MODEL_ACCOUNT_DISCRIMINATOR } from '../accounts/lendingRewardsRateModel';
import { MINT_INSTRUCTION_DISCRIMINATOR, parseMintInstruction, type ParsedMintInstruction } from '../instructions/mint';
import {
    MINT_WITH_MAX_ASSETS_INSTRUCTION_DISCRIMINATOR,
    parseMintWithMaxAssetsInstruction,
    type ParsedMintWithMaxAssetsInstruction,
} from '../instructions/mintWithMaxAssets';
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
import {
    REDEEM_INSTRUCTION_DISCRIMINATOR,
    parseRedeemInstruction,
    type ParsedRedeemInstruction,
} from '../instructions/redeem';
import {
    REDEEM_WITH_MIN_AMOUNT_OUT_INSTRUCTION_DISCRIMINATOR,
    parseRedeemWithMinAmountOutInstruction,
    type ParsedRedeemWithMinAmountOutInstruction,
} from '../instructions/redeemWithMinAmountOut';
import {
    SET_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR,
    parseSetRewardsRateModelInstruction,
    type ParsedSetRewardsRateModelInstruction,
} from '../instructions/setRewardsRateModel';
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
    UPDATE_RATE_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRateInstruction,
    type ParsedUpdateRateInstruction,
} from '../instructions/updateRate';
import {
    UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR,
    parseUpdateRebalancerInstruction,
    type ParsedUpdateRebalancerInstruction,
} from '../instructions/updateRebalancer';
import { USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR } from '../accounts/userSupplyPosition';
import {
    WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawInstruction,
    type ParsedWithdrawInstruction,
} from '../instructions/withdraw';
import {
    WITHDRAW_WITH_MAX_SHARES_BURN_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawWithMaxSharesBurnInstruction,
    type ParsedWithdrawWithMaxSharesBurnInstruction,
} from '../instructions/withdrawWithMaxSharesBurn';

export const LENDEARN_PROGRAM_ID = new Address('jup3YeL8QhtSx1e253b2FDvsMNC87fDrgQZivbrndc9');
export const LEND_EARN_PROGRAM_ADDRESS = LENDEARN_PROGRAM_ID;

export interface LendEarnProgram {
    name: 'lendEarn';
    programId: Address;
}

export function getLendEarnProgram(programId: Address = LENDEARN_PROGRAM_ID): LendEarnProgram {
    return { name: 'lendEarn', programId };
}

export enum LendEarnAccount {
    Lending,
    LendingAdmin,
    LendingRewardsRateModel,
    TokenReserve,
    UserSupplyPosition,
}

export function identifyLendEarnAccount(account: { data: Uint8Array } | Uint8Array): LendEarnAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (LENDING_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendEarnAccount.Lending;
    if (LENDING_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnAccount.LendingAdmin;
    if (LENDING_REWARDS_RATE_MODEL_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnAccount.LendingRewardsRateModel;
    if (TOKEN_RESERVE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnAccount.TokenReserve;
    if (USER_SUPPLY_POSITION_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnAccount.UserSupplyPosition;
    throw new Error('Failed to identify LendEarn account');
}

export enum LendEarnInstruction {
    Deposit,
    DepositWithMinAmountOut,
    InitLending,
    InitLendingAdmin,
    Mint,
    MintWithMaxAssets,
    Rebalance,
    RebalanceWithAmounts,
    Redeem,
    RedeemWithMinAmountOut,
    SetRewardsRateModel,
    UpdateAuthority,
    UpdateAuths,
    UpdateRate,
    UpdateRebalancer,
    Withdraw,
    WithdrawWithMaxSharesBurn,
}

export function identifyLendEarnInstruction(instruction: { data: Uint8Array } | Uint8Array): LendEarnInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.Deposit;
    if (DEPOSIT_WITH_MIN_AMOUNT_OUT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.DepositWithMinAmountOut;
    if (INIT_LENDING_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.InitLending;
    if (INIT_LENDING_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.InitLendingAdmin;
    if (MINT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.Mint;
    if (MINT_WITH_MAX_ASSETS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.MintWithMaxAssets;
    if (REBALANCE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.Rebalance;
    if (REBALANCE_WITH_AMOUNTS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.RebalanceWithAmounts;
    if (REDEEM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.Redeem;
    if (REDEEM_WITH_MIN_AMOUNT_OUT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.RedeemWithMinAmountOut;
    if (SET_REWARDS_RATE_MODEL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.SetRewardsRateModel;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.UpdateAuthority;
    if (UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.UpdateAuths;
    if (UPDATE_RATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.UpdateRate;
    if (UPDATE_REBALANCER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.UpdateRebalancer;
    if (WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.Withdraw;
    if (WITHDRAW_WITH_MAX_SHARES_BURN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendEarnInstruction.WithdrawWithMaxSharesBurn;
    throw new Error('Failed to identify LendEarn instruction');
}

export type ParsedLendEarnInstruction =
    | ({ instructionType: LendEarnInstruction.Deposit } & ParsedDepositInstruction)
    | ({ instructionType: LendEarnInstruction.DepositWithMinAmountOut } & ParsedDepositWithMinAmountOutInstruction)
    | ({ instructionType: LendEarnInstruction.InitLending } & ParsedInitLendingInstruction)
    | ({ instructionType: LendEarnInstruction.InitLendingAdmin } & ParsedInitLendingAdminInstruction)
    | ({ instructionType: LendEarnInstruction.Mint } & ParsedMintInstruction)
    | ({ instructionType: LendEarnInstruction.MintWithMaxAssets } & ParsedMintWithMaxAssetsInstruction)
    | ({ instructionType: LendEarnInstruction.Rebalance } & ParsedRebalanceInstruction)
    | ({ instructionType: LendEarnInstruction.RebalanceWithAmounts } & ParsedRebalanceWithAmountsInstruction)
    | ({ instructionType: LendEarnInstruction.Redeem } & ParsedRedeemInstruction)
    | ({ instructionType: LendEarnInstruction.RedeemWithMinAmountOut } & ParsedRedeemWithMinAmountOutInstruction)
    | ({ instructionType: LendEarnInstruction.SetRewardsRateModel } & ParsedSetRewardsRateModelInstruction)
    | ({ instructionType: LendEarnInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction)
    | ({ instructionType: LendEarnInstruction.UpdateAuths } & ParsedUpdateAuthsInstruction)
    | ({ instructionType: LendEarnInstruction.UpdateRate } & ParsedUpdateRateInstruction)
    | ({ instructionType: LendEarnInstruction.UpdateRebalancer } & ParsedUpdateRebalancerInstruction)
    | ({ instructionType: LendEarnInstruction.Withdraw } & ParsedWithdrawInstruction)
    | ({ instructionType: LendEarnInstruction.WithdrawWithMaxSharesBurn } & ParsedWithdrawWithMaxSharesBurnInstruction);

export function parseLendEarnInstruction(instruction: TransactionInstruction): ParsedLendEarnInstruction {
    const instructionType = identifyLendEarnInstruction(instruction);
    switch (instructionType) {
        case LendEarnInstruction.Deposit:
            return {
                instructionType,
                ...parseDepositInstruction(instruction),
            };
        case LendEarnInstruction.DepositWithMinAmountOut:
            return {
                instructionType,
                ...parseDepositWithMinAmountOutInstruction(instruction),
            };
        case LendEarnInstruction.InitLending:
            return {
                instructionType,
                ...parseInitLendingInstruction(instruction),
            };
        case LendEarnInstruction.InitLendingAdmin:
            return {
                instructionType,
                ...parseInitLendingAdminInstruction(instruction),
            };
        case LendEarnInstruction.Mint:
            return {
                instructionType,
                ...parseMintInstruction(instruction),
            };
        case LendEarnInstruction.MintWithMaxAssets:
            return {
                instructionType,
                ...parseMintWithMaxAssetsInstruction(instruction),
            };
        case LendEarnInstruction.Rebalance:
            return {
                instructionType,
                ...parseRebalanceInstruction(instruction),
            };
        case LendEarnInstruction.RebalanceWithAmounts:
            return {
                instructionType,
                ...parseRebalanceWithAmountsInstruction(instruction),
            };
        case LendEarnInstruction.Redeem:
            return {
                instructionType,
                ...parseRedeemInstruction(instruction),
            };
        case LendEarnInstruction.RedeemWithMinAmountOut:
            return {
                instructionType,
                ...parseRedeemWithMinAmountOutInstruction(instruction),
            };
        case LendEarnInstruction.SetRewardsRateModel:
            return {
                instructionType,
                ...parseSetRewardsRateModelInstruction(instruction),
            };
        case LendEarnInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
        case LendEarnInstruction.UpdateAuths:
            return {
                instructionType,
                ...parseUpdateAuthsInstruction(instruction),
            };
        case LendEarnInstruction.UpdateRate:
            return {
                instructionType,
                ...parseUpdateRateInstruction(instruction),
            };
        case LendEarnInstruction.UpdateRebalancer:
            return {
                instructionType,
                ...parseUpdateRebalancerInstruction(instruction),
            };
        case LendEarnInstruction.Withdraw:
            return {
                instructionType,
                ...parseWithdrawInstruction(instruction),
            };
        case LendEarnInstruction.WithdrawWithMaxSharesBurn:
            return {
                instructionType,
                ...parseWithdrawWithMaxSharesBurnInstruction(instruction),
            };
    }
}
