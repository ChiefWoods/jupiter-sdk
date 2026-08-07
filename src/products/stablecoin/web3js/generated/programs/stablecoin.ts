import { Address, TransactionInstruction } from '@solana/web3.js';
import { BENEFACTOR_ACCOUNT_DISCRIMINATOR } from '../accounts/benefactor';
import { CONFIG_ACCOUNT_DISCRIMINATOR } from '../accounts/config';
import {
    CREATE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR,
    parseCreateBenefactorInstruction,
    type ParsedCreateBenefactorInstruction,
} from '../instructions/createBenefactor';
import {
    CREATE_OPERATOR_INSTRUCTION_DISCRIMINATOR,
    parseCreateOperatorInstruction,
    type ParsedCreateOperatorInstruction,
} from '../instructions/createOperator';
import {
    CREATE_VAULT_INSTRUCTION_DISCRIMINATOR,
    parseCreateVaultInstruction,
    type ParsedCreateVaultInstruction,
} from '../instructions/createVault';
import {
    DELETE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR,
    parseDeleteBenefactorInstruction,
    type ParsedDeleteBenefactorInstruction,
} from '../instructions/deleteBenefactor';
import {
    DELETE_OPERATOR_INSTRUCTION_DISCRIMINATOR,
    parseDeleteOperatorInstruction,
    type ParsedDeleteOperatorInstruction,
} from '../instructions/deleteOperator';
import { INIT_INSTRUCTION_DISCRIMINATOR, parseInitInstruction, type ParsedInitInstruction } from '../instructions/init';
import {
    MANAGE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR,
    parseManageBenefactorInstruction,
    type ParsedManageBenefactorInstruction,
} from '../instructions/manageBenefactor';
import {
    MANAGE_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseManageConfigInstruction,
    type ParsedManageConfigInstruction,
} from '../instructions/manageConfig';
import {
    MANAGE_OPERATOR_INSTRUCTION_DISCRIMINATOR,
    parseManageOperatorInstruction,
    type ParsedManageOperatorInstruction,
} from '../instructions/manageOperator';
import {
    MANAGE_VAULT_INSTRUCTION_DISCRIMINATOR,
    parseManageVaultInstruction,
    type ParsedManageVaultInstruction,
} from '../instructions/manageVault';
import { MINT_INSTRUCTION_DISCRIMINATOR, parseMintInstruction, type ParsedMintInstruction } from '../instructions/mint';
import { OPERATOR_ACCOUNT_DISCRIMINATOR } from '../accounts/operator';
import {
    REDEEM_INSTRUCTION_DISCRIMINATOR,
    parseRedeemInstruction,
    type ParsedRedeemInstruction,
} from '../instructions/redeem';
import { VAULT_ACCOUNT_DISCRIMINATOR } from '../accounts/vault';
import {
    WITHDRAW_INSTRUCTION_DISCRIMINATOR,
    parseWithdrawInstruction,
    type ParsedWithdrawInstruction,
} from '../instructions/withdraw';

export const STABLECOIN_PROGRAM_ID = new Address('JUPUSDecMzAVgztLe6eGhwUBj1Pn3j9WAXwmtHmfbRr');
export const STABLECOIN_PROGRAM_ADDRESS = STABLECOIN_PROGRAM_ID;

export interface StablecoinProgram {
    name: 'stablecoin';
    programId: Address;
}

export function getStablecoinProgram(programId: Address = STABLECOIN_PROGRAM_ID): StablecoinProgram {
    return { name: 'stablecoin', programId };
}

export enum StablecoinAccount {
    Benefactor,
    Config,
    Operator,
    Vault,
}

export function identifyStablecoinAccount(account: { data: Uint8Array } | Uint8Array): StablecoinAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (BENEFACTOR_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinAccount.Benefactor;
    if (CONFIG_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return StablecoinAccount.Config;
    if (OPERATOR_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinAccount.Operator;
    if (VAULT_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return StablecoinAccount.Vault;
    throw new Error('Failed to identify Stablecoin account');
}

export enum StablecoinInstruction {
    CreateBenefactor,
    CreateOperator,
    CreateVault,
    DeleteBenefactor,
    DeleteOperator,
    Init,
    ManageBenefactor,
    ManageConfig,
    ManageOperator,
    ManageVault,
    Mint,
    Redeem,
    Withdraw,
}

export function identifyStablecoinInstruction(instruction: { data: Uint8Array } | Uint8Array): StablecoinInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CREATE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.CreateBenefactor;
    if (CREATE_OPERATOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.CreateOperator;
    if (CREATE_VAULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.CreateVault;
    if (DELETE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.DeleteBenefactor;
    if (DELETE_OPERATOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.DeleteOperator;
    if (INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.Init;
    if (MANAGE_BENEFACTOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.ManageBenefactor;
    if (MANAGE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.ManageConfig;
    if (MANAGE_OPERATOR_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.ManageOperator;
    if (MANAGE_VAULT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.ManageVault;
    if (MINT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.Mint;
    if (REDEEM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.Redeem;
    if (WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return StablecoinInstruction.Withdraw;
    throw new Error('Failed to identify Stablecoin instruction');
}

export type ParsedStablecoinInstruction =
    | ({ instructionType: StablecoinInstruction.CreateBenefactor } & ParsedCreateBenefactorInstruction)
    | ({ instructionType: StablecoinInstruction.CreateOperator } & ParsedCreateOperatorInstruction)
    | ({ instructionType: StablecoinInstruction.CreateVault } & ParsedCreateVaultInstruction)
    | ({ instructionType: StablecoinInstruction.DeleteBenefactor } & ParsedDeleteBenefactorInstruction)
    | ({ instructionType: StablecoinInstruction.DeleteOperator } & ParsedDeleteOperatorInstruction)
    | ({ instructionType: StablecoinInstruction.Init } & ParsedInitInstruction)
    | ({ instructionType: StablecoinInstruction.ManageBenefactor } & ParsedManageBenefactorInstruction)
    | ({ instructionType: StablecoinInstruction.ManageConfig } & ParsedManageConfigInstruction)
    | ({ instructionType: StablecoinInstruction.ManageOperator } & ParsedManageOperatorInstruction)
    | ({ instructionType: StablecoinInstruction.ManageVault } & ParsedManageVaultInstruction)
    | ({ instructionType: StablecoinInstruction.Mint } & ParsedMintInstruction)
    | ({ instructionType: StablecoinInstruction.Redeem } & ParsedRedeemInstruction)
    | ({ instructionType: StablecoinInstruction.Withdraw } & ParsedWithdrawInstruction);

export function parseStablecoinInstruction(instruction: TransactionInstruction): ParsedStablecoinInstruction {
    const instructionType = identifyStablecoinInstruction(instruction);
    switch (instructionType) {
        case StablecoinInstruction.CreateBenefactor:
            return {
                instructionType,
                ...parseCreateBenefactorInstruction(instruction),
            };
        case StablecoinInstruction.CreateOperator:
            return {
                instructionType,
                ...parseCreateOperatorInstruction(instruction),
            };
        case StablecoinInstruction.CreateVault:
            return {
                instructionType,
                ...parseCreateVaultInstruction(instruction),
            };
        case StablecoinInstruction.DeleteBenefactor:
            return {
                instructionType,
                ...parseDeleteBenefactorInstruction(instruction),
            };
        case StablecoinInstruction.DeleteOperator:
            return {
                instructionType,
                ...parseDeleteOperatorInstruction(instruction),
            };
        case StablecoinInstruction.Init:
            return {
                instructionType,
                ...parseInitInstruction(instruction),
            };
        case StablecoinInstruction.ManageBenefactor:
            return {
                instructionType,
                ...parseManageBenefactorInstruction(instruction),
            };
        case StablecoinInstruction.ManageConfig:
            return {
                instructionType,
                ...parseManageConfigInstruction(instruction),
            };
        case StablecoinInstruction.ManageOperator:
            return {
                instructionType,
                ...parseManageOperatorInstruction(instruction),
            };
        case StablecoinInstruction.ManageVault:
            return {
                instructionType,
                ...parseManageVaultInstruction(instruction),
            };
        case StablecoinInstruction.Mint:
            return {
                instructionType,
                ...parseMintInstruction(instruction),
            };
        case StablecoinInstruction.Redeem:
            return {
                instructionType,
                ...parseRedeemInstruction(instruction),
            };
        case StablecoinInstruction.Withdraw:
            return {
                instructionType,
                ...parseWithdrawInstruction(instruction),
            };
    }
}
