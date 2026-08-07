import { Address, TransactionInstruction } from '@solana/web3.js';
import { CHAINLINK_DATA_STREAMS_CACHE_ACCOUNT_DISCRIMINATOR } from '../accounts/chainlinkDataStreamsCache';
import {
    CHAINLINK_DATA_STREAMS_FEED_ACCESS_CONTROLLER_INSTRUCTION_DISCRIMINATOR,
    parseChainlinkDataStreamsFeedAccessControllerInstruction,
    type ParsedChainlinkDataStreamsFeedAccessControllerInstruction,
} from '../instructions/chainlinkDataStreamsFeedAccessController';
import { DEX_PEG_ORACLE_CONFIG_ACCOUNT_DISCRIMINATOR } from '../accounts/dexPegOracleConfig';
import {
    GET_BOTH_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR,
    parseGetBothExchangeRateInstruction,
    type ParsedGetBothExchangeRateInstruction,
} from '../instructions/getBothExchangeRate';
import {
    GET_CENTER_PRICE_INSTRUCTION_DISCRIMINATOR,
    parseGetCenterPriceInstruction,
    type ParsedGetCenterPriceInstruction,
} from '../instructions/getCenterPrice';
import {
    GET_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR,
    parseGetExchangeRateInstruction,
    type ParsedGetExchangeRateInstruction,
} from '../instructions/getExchangeRate';
import {
    GET_EXCHANGE_RATE_LIQUIDATE_INSTRUCTION_DISCRIMINATOR,
    parseGetExchangeRateLiquidateInstruction,
    type ParsedGetExchangeRateLiquidateInstruction,
} from '../instructions/getExchangeRateLiquidate';
import {
    GET_EXCHANGE_RATE_OPERATE_INSTRUCTION_DISCRIMINATOR,
    parseGetExchangeRateOperateInstruction,
    type ParsedGetExchangeRateOperateInstruction,
} from '../instructions/getExchangeRateOperate';
import {
    INIT_ADMIN_INSTRUCTION_DISCRIMINATOR,
    parseInitAdminInstruction,
    type ParsedInitAdminInstruction,
} from '../instructions/initAdmin';
import {
    INIT_CHAINLINK_DATA_STREAMS_CACHE_INSTRUCTION_DISCRIMINATOR,
    parseInitChainlinkDataStreamsCacheInstruction,
    type ParsedInitChainlinkDataStreamsCacheInstruction,
} from '../instructions/initChainlinkDataStreamsCache';
import {
    INIT_DEX_PEG_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseInitDexPegOracleConfigInstruction,
    type ParsedInitDexPegOracleConfigInstruction,
} from '../instructions/initDexPegOracleConfig';
import {
    INIT_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR,
    parseInitOracleConfigInstruction,
    type ParsedInitOracleConfigInstruction,
} from '../instructions/initOracleConfig';
import { ORACLE_ACCOUNT_DISCRIMINATOR } from '../accounts/oracle';
import { ORACLE_ADMIN_ACCOUNT_DISCRIMINATOR } from '../accounts/oracleAdmin';
import {
    REFRESH_PRICE_FEED_WITH_CHAINLINK_INSTRUCTION_DISCRIMINATOR,
    parseRefreshPriceFeedWithChainlinkInstruction,
    type ParsedRefreshPriceFeedWithChainlinkInstruction,
} from '../instructions/refreshPriceFeedWithChainlink';
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
    UPDATE_CHAINLINK_DATA_STREAMS_CACHE_FEEDS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateChainlinkDataStreamsCacheFeedsInstruction,
    type ParsedUpdateChainlinkDataStreamsCacheFeedsInstruction,
} from '../instructions/updateChainlinkDataStreamsCacheFeeds';
import {
    UPDATE_CHAINLINK_DATA_STREAMS_CACHE_KEEPERS_INSTRUCTION_DISCRIMINATOR,
    parseUpdateChainlinkDataStreamsCacheKeepersInstruction,
    type ParsedUpdateChainlinkDataStreamsCacheKeepersInstruction,
} from '../instructions/updateChainlinkDataStreamsCacheKeepers';

export const LENDORACLE_PROGRAM_ID = new Address('jupnw4B6Eqs7ft6rxpzYLJZYSnrpRgPcr589n5Kv4oc');
export const LEND_ORACLE_PROGRAM_ADDRESS = LENDORACLE_PROGRAM_ID;

export interface LendOracleProgram {
    name: 'lendOracle';
    programId: Address;
}

export function getLendOracleProgram(programId: Address = LENDORACLE_PROGRAM_ID): LendOracleProgram {
    return { name: 'lendOracle', programId };
}

export enum LendOracleAccount {
    ChainlinkDataStreamsCache,
    DexPegOracleConfig,
    Oracle,
    OracleAdmin,
}

export function identifyLendOracleAccount(account: { data: Uint8Array } | Uint8Array): LendOracleAccount {
    const data = account instanceof Uint8Array ? account : account.data;
    if (CHAINLINK_DATA_STREAMS_CACHE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleAccount.ChainlinkDataStreamsCache;
    if (DEX_PEG_ORACLE_CONFIG_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleAccount.DexPegOracleConfig;
    if (ORACLE_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte)) return LendOracleAccount.Oracle;
    if (ORACLE_ADMIN_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleAccount.OracleAdmin;
    throw new Error('Failed to identify LendOracle account');
}

export enum LendOracleInstruction {
    ChainlinkDataStreamsFeedAccessController,
    GetBothExchangeRate,
    GetCenterPrice,
    GetExchangeRate,
    GetExchangeRateLiquidate,
    GetExchangeRateOperate,
    InitAdmin,
    InitChainlinkDataStreamsCache,
    InitDexPegOracleConfig,
    InitOracleConfig,
    RefreshPriceFeedWithChainlink,
    UpdateAuthority,
    UpdateAuths,
    UpdateChainlinkDataStreamsCacheFeeds,
    UpdateChainlinkDataStreamsCacheKeepers,
}

export function identifyLendOracleInstruction(instruction: { data: Uint8Array } | Uint8Array): LendOracleInstruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (
        CHAINLINK_DATA_STREAMS_FEED_ACCESS_CONTROLLER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return LendOracleInstruction.ChainlinkDataStreamsFeedAccessController;
    if (GET_BOTH_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.GetBothExchangeRate;
    if (GET_CENTER_PRICE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.GetCenterPrice;
    if (GET_EXCHANGE_RATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.GetExchangeRate;
    if (GET_EXCHANGE_RATE_LIQUIDATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.GetExchangeRateLiquidate;
    if (GET_EXCHANGE_RATE_OPERATE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.GetExchangeRateOperate;
    if (INIT_ADMIN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.InitAdmin;
    if (INIT_CHAINLINK_DATA_STREAMS_CACHE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.InitChainlinkDataStreamsCache;
    if (INIT_DEX_PEG_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.InitDexPegOracleConfig;
    if (INIT_ORACLE_CONFIG_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.InitOracleConfig;
    if (REFRESH_PRICE_FEED_WITH_CHAINLINK_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.RefreshPriceFeedWithChainlink;
    if (UPDATE_AUTHORITY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.UpdateAuthority;
    if (UPDATE_AUTHS_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return LendOracleInstruction.UpdateAuths;
    if (
        UPDATE_CHAINLINK_DATA_STREAMS_CACHE_FEEDS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return LendOracleInstruction.UpdateChainlinkDataStreamsCacheFeeds;
    if (
        UPDATE_CHAINLINK_DATA_STREAMS_CACHE_KEEPERS_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return LendOracleInstruction.UpdateChainlinkDataStreamsCacheKeepers;
    throw new Error('Failed to identify LendOracle instruction');
}

export type ParsedLendOracleInstruction =
    | ({
          instructionType: LendOracleInstruction.ChainlinkDataStreamsFeedAccessController;
      } & ParsedChainlinkDataStreamsFeedAccessControllerInstruction)
    | ({ instructionType: LendOracleInstruction.GetBothExchangeRate } & ParsedGetBothExchangeRateInstruction)
    | ({ instructionType: LendOracleInstruction.GetCenterPrice } & ParsedGetCenterPriceInstruction)
    | ({ instructionType: LendOracleInstruction.GetExchangeRate } & ParsedGetExchangeRateInstruction)
    | ({ instructionType: LendOracleInstruction.GetExchangeRateLiquidate } & ParsedGetExchangeRateLiquidateInstruction)
    | ({ instructionType: LendOracleInstruction.GetExchangeRateOperate } & ParsedGetExchangeRateOperateInstruction)
    | ({ instructionType: LendOracleInstruction.InitAdmin } & ParsedInitAdminInstruction)
    | ({
          instructionType: LendOracleInstruction.InitChainlinkDataStreamsCache;
      } & ParsedInitChainlinkDataStreamsCacheInstruction)
    | ({ instructionType: LendOracleInstruction.InitDexPegOracleConfig } & ParsedInitDexPegOracleConfigInstruction)
    | ({ instructionType: LendOracleInstruction.InitOracleConfig } & ParsedInitOracleConfigInstruction)
    | ({
          instructionType: LendOracleInstruction.RefreshPriceFeedWithChainlink;
      } & ParsedRefreshPriceFeedWithChainlinkInstruction)
    | ({ instructionType: LendOracleInstruction.UpdateAuthority } & ParsedUpdateAuthorityInstruction)
    | ({ instructionType: LendOracleInstruction.UpdateAuths } & ParsedUpdateAuthsInstruction)
    | ({
          instructionType: LendOracleInstruction.UpdateChainlinkDataStreamsCacheFeeds;
      } & ParsedUpdateChainlinkDataStreamsCacheFeedsInstruction)
    | ({
          instructionType: LendOracleInstruction.UpdateChainlinkDataStreamsCacheKeepers;
      } & ParsedUpdateChainlinkDataStreamsCacheKeepersInstruction);

export function parseLendOracleInstruction(instruction: TransactionInstruction): ParsedLendOracleInstruction {
    const instructionType = identifyLendOracleInstruction(instruction);
    switch (instructionType) {
        case LendOracleInstruction.ChainlinkDataStreamsFeedAccessController:
            return {
                instructionType,
                ...parseChainlinkDataStreamsFeedAccessControllerInstruction(instruction),
            };
        case LendOracleInstruction.GetBothExchangeRate:
            return {
                instructionType,
                ...parseGetBothExchangeRateInstruction(instruction),
            };
        case LendOracleInstruction.GetCenterPrice:
            return {
                instructionType,
                ...parseGetCenterPriceInstruction(instruction),
            };
        case LendOracleInstruction.GetExchangeRate:
            return {
                instructionType,
                ...parseGetExchangeRateInstruction(instruction),
            };
        case LendOracleInstruction.GetExchangeRateLiquidate:
            return {
                instructionType,
                ...parseGetExchangeRateLiquidateInstruction(instruction),
            };
        case LendOracleInstruction.GetExchangeRateOperate:
            return {
                instructionType,
                ...parseGetExchangeRateOperateInstruction(instruction),
            };
        case LendOracleInstruction.InitAdmin:
            return {
                instructionType,
                ...parseInitAdminInstruction(instruction),
            };
        case LendOracleInstruction.InitChainlinkDataStreamsCache:
            return {
                instructionType,
                ...parseInitChainlinkDataStreamsCacheInstruction(instruction),
            };
        case LendOracleInstruction.InitDexPegOracleConfig:
            return {
                instructionType,
                ...parseInitDexPegOracleConfigInstruction(instruction),
            };
        case LendOracleInstruction.InitOracleConfig:
            return {
                instructionType,
                ...parseInitOracleConfigInstruction(instruction),
            };
        case LendOracleInstruction.RefreshPriceFeedWithChainlink:
            return {
                instructionType,
                ...parseRefreshPriceFeedWithChainlinkInstruction(instruction),
            };
        case LendOracleInstruction.UpdateAuthority:
            return {
                instructionType,
                ...parseUpdateAuthorityInstruction(instruction),
            };
        case LendOracleInstruction.UpdateAuths:
            return {
                instructionType,
                ...parseUpdateAuthsInstruction(instruction),
            };
        case LendOracleInstruction.UpdateChainlinkDataStreamsCacheFeeds:
            return {
                instructionType,
                ...parseUpdateChainlinkDataStreamsCacheFeedsInstruction(instruction),
            };
        case LendOracleInstruction.UpdateChainlinkDataStreamsCacheKeepers:
            return {
                instructionType,
                ...parseUpdateChainlinkDataStreamsCacheKeepersInstruction(instruction),
            };
    }
}
