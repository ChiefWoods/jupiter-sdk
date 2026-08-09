import { Address, TransactionInstruction } from '@solana/web3.js';
import { BASE_ASSET_V1_ACCOUNT_DISCRIMINATOR } from '../accounts/baseAssetV1';
import {
    CANCEL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseCancelOfferInstruction,
    type ParsedCancelOfferInstruction,
} from '../instructions/cancelOffer';
import {
    CLAIM_FEE_INSTRUCTION_DISCRIMINATOR,
    parseClaimFeeInstruction,
    type ParsedClaimFeeInstruction,
} from '../instructions/claimFee';
import {
    CLAIM_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR,
    parseClaimNonFungibleLoanInstruction,
    type ParsedClaimNonFungibleLoanInstruction,
} from '../instructions/claimNonFungibleLoan';
import {
    CLAIM_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR,
    parseClaimTokenLoanInstruction,
    type ParsedClaimTokenLoanInstruction,
} from '../instructions/claimTokenLoan';
import { CONFIG_ACCOUNT_DISCRIMINATOR } from '../accounts/config';
import {
    CREATE_NFT_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseCreateNftCollateralOfferInstruction,
    type ParsedCreateNftCollateralOfferInstruction,
} from '../instructions/createNftCollateralOffer';
import {
    CREATE_NFT_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseCreateNftPrincipalOfferInstruction,
    type ParsedCreateNftPrincipalOfferInstruction,
} from '../instructions/createNftPrincipalOffer';
import {
    CREATE_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseCreateTokenCollateralOfferInstruction,
    type ParsedCreateTokenCollateralOfferInstruction,
} from '../instructions/createTokenCollateralOffer';
import {
    CREATE_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseCreateTokenPrincipalOfferInstruction,
    type ParsedCreateTokenPrincipalOfferInstruction,
} from '../instructions/createTokenPrincipalOffer';
import {
    CREATE_USER_INSTRUCTION_DISCRIMINATOR,
    parseCreateUserInstruction,
    type ParsedCreateUserInstruction,
} from '../instructions/createUser';
import {
    ESCROW_CLASSIC_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR,
    parseEscrowClassicNftDepositInstruction,
    type ParsedEscrowClassicNftDepositInstruction,
} from '../instructions/escrowClassicNftDeposit';
import {
    ESCROW_CLASSIC_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseEscrowClassicNftWithdrawInstruction,
    type ParsedEscrowClassicNftWithdrawInstruction,
} from '../instructions/escrowClassicNftWithdraw';
import {
    ESCROW_CORE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR,
    parseEscrowCoreNftDepositInstruction,
    type ParsedEscrowCoreNftDepositInstruction,
} from '../instructions/escrowCoreNftDeposit';
import {
    ESCROW_CORE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseEscrowCoreNftWithdrawInstruction,
    type ParsedEscrowCoreNftWithdrawInstruction,
} from '../instructions/escrowCoreNftWithdraw';
import {
    ESCROW_PROGRAMMABLE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR,
    parseEscrowProgrammableNftDepositInstruction,
    type ParsedEscrowProgrammableNftDepositInstruction,
} from '../instructions/escrowProgrammableNftDeposit';
import {
    ESCROW_PROGRAMMABLE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseEscrowProgrammableNftWithdrawInstruction,
    type ParsedEscrowProgrammableNftWithdrawInstruction,
} from '../instructions/escrowProgrammableNftWithdraw';
import {
    ESCROW_TOKEN_DEPOSIT_INSTRUCTION_DISCRIMINATOR,
    parseEscrowTokenDepositInstruction,
    type ParsedEscrowTokenDepositInstruction,
} from '../instructions/escrowTokenDeposit';
import {
    ESCROW_TOKEN_WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseEscrowTokenWithdrawInstruction,
    type ParsedEscrowTokenWithdrawInstruction,
} from '../instructions/escrowTokenWithdraw';
import {
    EXTEND_LOAN_INSTRUCTION_DISCRIMINATOR,
    parseExtendLoanInstruction,
    type ParsedExtendLoanInstruction,
} from '../instructions/extendLoan';
import {
    FILL_NON_FUNGIBLE_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseFillNonFungibleCollateralOfferInstruction,
    type ParsedFillNonFungibleCollateralOfferInstruction,
} from '../instructions/fillNonFungibleCollateralOffer';
import {
    FILL_NON_FUNGIBLE_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseFillNonFungiblePrincipalOfferInstruction,
    type ParsedFillNonFungiblePrincipalOfferInstruction,
} from '../instructions/fillNonFungiblePrincipalOffer';
import {
    FILL_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseFillTokenCollateralOfferInstruction,
    type ParsedFillTokenCollateralOfferInstruction,
} from '../instructions/fillTokenCollateralOffer';
import {
    FILL_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR,
    parseFillTokenPrincipalOfferInstruction,
    type ParsedFillTokenPrincipalOfferInstruction,
} from '../instructions/fillTokenPrincipalOffer';
import { INIT_INSTRUCTION_DISCRIMINATOR, parseInitInstruction, type ParsedInitInstruction } from '../instructions/init';
import { LOAN_ACCOUNT_DISCRIMINATOR } from '../accounts/loan';
import { OFFER_ACCOUNT_DISCRIMINATOR } from '../accounts/offer';
import {
    REPAY_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR,
    parseRepayNonFungibleLoanInstruction,
    type ParsedRepayNonFungibleLoanInstruction,
} from '../instructions/repayNonFungibleLoan';
import {
    REPAY_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR,
    parseRepayTokenLoanInstruction,
    type ParsedRepayTokenLoanInstruction,
} from '../instructions/repayTokenLoan';
import {
    SET_LOAN_EXTENDABLE_INSTRUCTION_DISCRIMINATOR,
    parseSetLoanExtendableInstruction,
    type ParsedSetLoanExtendableInstruction,
} from '../instructions/setLoanExtendable';
import {
    UPDATE_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseUpdateConfigInstruction,
    type ParsedUpdateConfigInstruction,
} from '../instructions/updateConfig';
import { USER_ACCOUNT_DISCRIMINATOR } from '../accounts/user';

export const OFFERBOOK_PROGRAM_ID = new Address('offerbkFMvVfpQhL8ZQ5iromnjct5rz3r52B9ewu3ie');
export const OFFERBOOK_PROGRAM_ADDRESS = OFFERBOOK_PROGRAM_ID;

export interface OfferbookProgram {
    name: 'offerbook';
    programId: Address;
}

export function getOfferbookProgram(programId: Address = OFFERBOOK_PROGRAM_ID): OfferbookProgram {
    return { name: 'offerbook', programId };
}

export enum OfferbookAccount {
    BaseAssetV1,
    Config,
    Loan,
    Offer,
    User,
}

export function identifyOfferbookAccount(account: { data: Uint8Array } | Uint8Array): OfferbookAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (BASE_ASSET_V1_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookAccount.BaseAssetV1;
    if (CONFIG_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return OfferbookAccount.Config;
    if (LOAN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return OfferbookAccount.Loan;
    if (OFFER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return OfferbookAccount.Offer;
    if (USER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return OfferbookAccount.User;
    throw new Error('Failed to identify Offerbook account');
}

export enum OfferbookInstruction {
    CancelOffer,
    ClaimFee,
    ClaimNonFungibleLoan,
    ClaimTokenLoan,
    CreateNftCollateralOffer,
    CreateNftPrincipalOffer,
    CreateTokenCollateralOffer,
    CreateTokenPrincipalOffer,
    CreateUser,
    EscrowClassicNftDeposit,
    EscrowClassicNftWithdraw,
    EscrowCoreNftDeposit,
    EscrowCoreNftWithdraw,
    EscrowProgrammableNftDeposit,
    EscrowProgrammableNftWithdraw,
    EscrowTokenDeposit,
    EscrowTokenWithdraw,
    ExtendLoan,
    FillNonFungibleCollateralOffer,
    FillNonFungiblePrincipalOffer,
    FillTokenCollateralOffer,
    FillTokenPrincipalOffer,
    Init,
    RepayNonFungibleLoan,
    RepayTokenLoan,
    SetLoanExtendable,
    UpdateConfig,
}

export function identifyOfferbookInstruction(instruction: { data: Uint8Array } | Uint8Array): OfferbookInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CANCEL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.CancelOffer;
    if (CLAIM_FEE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.ClaimFee;
    if (CLAIM_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.ClaimNonFungibleLoan;
    if (CLAIM_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.ClaimTokenLoan;
    if (CREATE_NFT_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.CreateNftCollateralOffer;
    if (CREATE_NFT_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.CreateNftPrincipalOffer;
    if (CREATE_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.CreateTokenCollateralOffer;
    if (CREATE_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.CreateTokenPrincipalOffer;
    if (CREATE_USER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.CreateUser;
    if (ESCROW_CLASSIC_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowClassicNftDeposit;
    if (ESCROW_CLASSIC_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowClassicNftWithdraw;
    if (ESCROW_CORE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowCoreNftDeposit;
    if (ESCROW_CORE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowCoreNftWithdraw;
    if (ESCROW_PROGRAMMABLE_NFT_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowProgrammableNftDeposit;
    if (ESCROW_PROGRAMMABLE_NFT_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowProgrammableNftWithdraw;
    if (ESCROW_TOKEN_DEPOSIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowTokenDeposit;
    if (ESCROW_TOKEN_WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.EscrowTokenWithdraw;
    if (EXTEND_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.ExtendLoan;
    if (FILL_NON_FUNGIBLE_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.FillNonFungibleCollateralOffer;
    if (FILL_NON_FUNGIBLE_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.FillNonFungiblePrincipalOffer;
    if (FILL_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.FillTokenCollateralOffer;
    if (FILL_TOKEN_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.FillTokenPrincipalOffer;
    if (INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.Init;
    if (REPAY_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.RepayNonFungibleLoan;
    if (REPAY_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.RepayTokenLoan;
    if (SET_LOAN_EXTENDABLE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.SetLoanExtendable;
    if (UPDATE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return OfferbookInstruction.UpdateConfig;
    throw new Error('Failed to identify Offerbook instruction');
}

export type ParsedOfferbookInstruction =
    | ({ instructionType: OfferbookInstruction.CancelOffer } & ParsedCancelOfferInstruction)
    | ({ instructionType: OfferbookInstruction.ClaimFee } & ParsedClaimFeeInstruction)
    | ({ instructionType: OfferbookInstruction.ClaimNonFungibleLoan } & ParsedClaimNonFungibleLoanInstruction)
    | ({ instructionType: OfferbookInstruction.ClaimTokenLoan } & ParsedClaimTokenLoanInstruction)
    | ({ instructionType: OfferbookInstruction.CreateNftCollateralOffer } & ParsedCreateNftCollateralOfferInstruction)
    | ({ instructionType: OfferbookInstruction.CreateNftPrincipalOffer } & ParsedCreateNftPrincipalOfferInstruction)
    | ({
          instructionType: OfferbookInstruction.CreateTokenCollateralOffer;
      } & ParsedCreateTokenCollateralOfferInstruction)
    | ({ instructionType: OfferbookInstruction.CreateTokenPrincipalOffer } & ParsedCreateTokenPrincipalOfferInstruction)
    | ({ instructionType: OfferbookInstruction.CreateUser } & ParsedCreateUserInstruction)
    | ({ instructionType: OfferbookInstruction.EscrowClassicNftDeposit } & ParsedEscrowClassicNftDepositInstruction)
    | ({ instructionType: OfferbookInstruction.EscrowClassicNftWithdraw } & ParsedEscrowClassicNftWithdrawInstruction)
    | ({ instructionType: OfferbookInstruction.EscrowCoreNftDeposit } & ParsedEscrowCoreNftDepositInstruction)
    | ({ instructionType: OfferbookInstruction.EscrowCoreNftWithdraw } & ParsedEscrowCoreNftWithdrawInstruction)
    | ({
          instructionType: OfferbookInstruction.EscrowProgrammableNftDeposit;
      } & ParsedEscrowProgrammableNftDepositInstruction)
    | ({
          instructionType: OfferbookInstruction.EscrowProgrammableNftWithdraw;
      } & ParsedEscrowProgrammableNftWithdrawInstruction)
    | ({ instructionType: OfferbookInstruction.EscrowTokenDeposit } & ParsedEscrowTokenDepositInstruction)
    | ({ instructionType: OfferbookInstruction.EscrowTokenWithdraw } & ParsedEscrowTokenWithdrawInstruction)
    | ({ instructionType: OfferbookInstruction.ExtendLoan } & ParsedExtendLoanInstruction)
    | ({
          instructionType: OfferbookInstruction.FillNonFungibleCollateralOffer;
      } & ParsedFillNonFungibleCollateralOfferInstruction)
    | ({
          instructionType: OfferbookInstruction.FillNonFungiblePrincipalOffer;
      } & ParsedFillNonFungiblePrincipalOfferInstruction)
    | ({ instructionType: OfferbookInstruction.FillTokenCollateralOffer } & ParsedFillTokenCollateralOfferInstruction)
    | ({ instructionType: OfferbookInstruction.FillTokenPrincipalOffer } & ParsedFillTokenPrincipalOfferInstruction)
    | ({ instructionType: OfferbookInstruction.Init } & ParsedInitInstruction)
    | ({ instructionType: OfferbookInstruction.RepayNonFungibleLoan } & ParsedRepayNonFungibleLoanInstruction)
    | ({ instructionType: OfferbookInstruction.RepayTokenLoan } & ParsedRepayTokenLoanInstruction)
    | ({ instructionType: OfferbookInstruction.SetLoanExtendable } & ParsedSetLoanExtendableInstruction)
    | ({ instructionType: OfferbookInstruction.UpdateConfig } & ParsedUpdateConfigInstruction);

export function parseOfferbookInstruction(instruction: TransactionInstruction): ParsedOfferbookInstruction {
    const instructionType = identifyOfferbookInstruction(instruction);
    switch (instructionType) {
        case OfferbookInstruction.CancelOffer:
            return {
                instructionType,
                ...parseCancelOfferInstruction(instruction),
            };
        case OfferbookInstruction.ClaimFee:
            return {
                instructionType,
                ...parseClaimFeeInstruction(instruction),
            };
        case OfferbookInstruction.ClaimNonFungibleLoan:
            return {
                instructionType,
                ...parseClaimNonFungibleLoanInstruction(instruction),
            };
        case OfferbookInstruction.ClaimTokenLoan:
            return {
                instructionType,
                ...parseClaimTokenLoanInstruction(instruction),
            };
        case OfferbookInstruction.CreateNftCollateralOffer:
            return {
                instructionType,
                ...parseCreateNftCollateralOfferInstruction(instruction),
            };
        case OfferbookInstruction.CreateNftPrincipalOffer:
            return {
                instructionType,
                ...parseCreateNftPrincipalOfferInstruction(instruction),
            };
        case OfferbookInstruction.CreateTokenCollateralOffer:
            return {
                instructionType,
                ...parseCreateTokenCollateralOfferInstruction(instruction),
            };
        case OfferbookInstruction.CreateTokenPrincipalOffer:
            return {
                instructionType,
                ...parseCreateTokenPrincipalOfferInstruction(instruction),
            };
        case OfferbookInstruction.CreateUser:
            return {
                instructionType,
                ...parseCreateUserInstruction(instruction),
            };
        case OfferbookInstruction.EscrowClassicNftDeposit:
            return {
                instructionType,
                ...parseEscrowClassicNftDepositInstruction(instruction),
            };
        case OfferbookInstruction.EscrowClassicNftWithdraw:
            return {
                instructionType,
                ...parseEscrowClassicNftWithdrawInstruction(instruction),
            };
        case OfferbookInstruction.EscrowCoreNftDeposit:
            return {
                instructionType,
                ...parseEscrowCoreNftDepositInstruction(instruction),
            };
        case OfferbookInstruction.EscrowCoreNftWithdraw:
            return {
                instructionType,
                ...parseEscrowCoreNftWithdrawInstruction(instruction),
            };
        case OfferbookInstruction.EscrowProgrammableNftDeposit:
            return {
                instructionType,
                ...parseEscrowProgrammableNftDepositInstruction(instruction),
            };
        case OfferbookInstruction.EscrowProgrammableNftWithdraw:
            return {
                instructionType,
                ...parseEscrowProgrammableNftWithdrawInstruction(instruction),
            };
        case OfferbookInstruction.EscrowTokenDeposit:
            return {
                instructionType,
                ...parseEscrowTokenDepositInstruction(instruction),
            };
        case OfferbookInstruction.EscrowTokenWithdraw:
            return {
                instructionType,
                ...parseEscrowTokenWithdrawInstruction(instruction),
            };
        case OfferbookInstruction.ExtendLoan:
            return {
                instructionType,
                ...parseExtendLoanInstruction(instruction),
            };
        case OfferbookInstruction.FillNonFungibleCollateralOffer:
            return {
                instructionType,
                ...parseFillNonFungibleCollateralOfferInstruction(instruction),
            };
        case OfferbookInstruction.FillNonFungiblePrincipalOffer:
            return {
                instructionType,
                ...parseFillNonFungiblePrincipalOfferInstruction(instruction),
            };
        case OfferbookInstruction.FillTokenCollateralOffer:
            return {
                instructionType,
                ...parseFillTokenCollateralOfferInstruction(instruction),
            };
        case OfferbookInstruction.FillTokenPrincipalOffer:
            return {
                instructionType,
                ...parseFillTokenPrincipalOfferInstruction(instruction),
            };
        case OfferbookInstruction.Init:
            return {
                instructionType,
                ...parseInitInstruction(instruction),
            };
        case OfferbookInstruction.RepayNonFungibleLoan:
            return {
                instructionType,
                ...parseRepayNonFungibleLoanInstruction(instruction),
            };
        case OfferbookInstruction.RepayTokenLoan:
            return {
                instructionType,
                ...parseRepayTokenLoanInstruction(instruction),
            };
        case OfferbookInstruction.SetLoanExtendable:
            return {
                instructionType,
                ...parseSetLoanExtendableInstruction(instruction),
            };
        case OfferbookInstruction.UpdateConfig:
            return {
                instructionType,
                ...parseUpdateConfigInstruction(instruction),
            };
    }
}
