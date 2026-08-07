import { Address, TransactionInstruction } from '@solana/web3.js';
import {
    CLAIM_INSTRUCTION_DISCRIMINATOR,
    parseClaimInstruction,
    type ParsedClaimInstruction,
} from '../instructions/claim';
import {
    CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseClaimTokenInstruction,
    type ParsedClaimTokenInstruction,
} from '../instructions/claimToken';
import {
    CLOSE_TOKEN_INSTRUCTION_DISCRIMINATOR,
    parseCloseTokenInstruction,
    type ParsedCloseTokenInstruction,
} from '../instructions/closeToken';
import {
    CLOSE_WSOL_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR,
    parseCloseWsolTokenAccountInstruction,
    type ParsedCloseWsolTokenAccountInstruction,
} from '../instructions/closeWsolTokenAccount';
import {
    CREATE_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR,
    parseCreateTokenAccountInstruction,
    type ParsedCreateTokenAccountInstruction,
} from '../instructions/createTokenAccount';
import {
    CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseCreateTokenLedgerInstruction,
    type ParsedCreateTokenLedgerInstruction,
} from '../instructions/createTokenLedger';
import {
    EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR,
    parseExactOutRouteInstruction,
    type ParsedExactOutRouteInstruction,
} from '../instructions/exactOutRoute';
import {
    EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR,
    parseExactOutRouteV2Instruction,
    type ParsedExactOutRouteV2Instruction,
} from '../instructions/exactOutRouteV2';
import {
    ROUTE_INSTRUCTION_DISCRIMINATOR,
    parseRouteInstruction,
    type ParsedRouteInstruction,
} from '../instructions/route';
import {
    ROUTE_V2_INSTRUCTION_DISCRIMINATOR,
    parseRouteV2Instruction,
    type ParsedRouteV2Instruction,
} from '../instructions/routeV2';
import {
    ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseRouteWithTokenLedgerInstruction,
    type ParsedRouteWithTokenLedgerInstruction,
} from '../instructions/routeWithTokenLedger';
import {
    SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseSetTokenLedgerInstruction,
    type ParsedSetTokenLedgerInstruction,
} from '../instructions/setTokenLedger';
import {
    SHARED_ACCOUNTS_EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR,
    parseSharedAccountsExactOutRouteInstruction,
    type ParsedSharedAccountsExactOutRouteInstruction,
} from '../instructions/sharedAccountsExactOutRoute';
import {
    SHARED_ACCOUNTS_EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR,
    parseSharedAccountsExactOutRouteV2Instruction,
    type ParsedSharedAccountsExactOutRouteV2Instruction,
} from '../instructions/sharedAccountsExactOutRouteV2';
import {
    SHARED_ACCOUNTS_ROUTE_INSTRUCTION_DISCRIMINATOR,
    parseSharedAccountsRouteInstruction,
    type ParsedSharedAccountsRouteInstruction,
} from '../instructions/sharedAccountsRoute';
import {
    SHARED_ACCOUNTS_ROUTE_V2_INSTRUCTION_DISCRIMINATOR,
    parseSharedAccountsRouteV2Instruction,
    type ParsedSharedAccountsRouteV2Instruction,
} from '../instructions/sharedAccountsRouteV2';
import {
    SHARED_ACCOUNTS_ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR,
    parseSharedAccountsRouteWithTokenLedgerInstruction,
    type ParsedSharedAccountsRouteWithTokenLedgerInstruction,
} from '../instructions/sharedAccountsRouteWithTokenLedger';
import { TOKEN_LEDGER_ACCOUNT_DISCRIMINATOR } from '../accounts/tokenLedger';

export const AGGREGATORV6_PROGRAM_ID = new Address('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4');
export const AGGREGATOR_V6_PROGRAM_ADDRESS = AGGREGATORV6_PROGRAM_ID;

export interface AggregatorV6Program {
    name: 'aggregatorV6';
    programId: Address;
}

export function getAggregatorV6Program(programId: Address = AGGREGATORV6_PROGRAM_ID): AggregatorV6Program {
    return { name: 'aggregatorV6', programId };
}

export enum AggregatorV6Account {
    TokenLedger,
}

export function identifyAggregatorV6Account(account: { data: Uint8Array } | Uint8Array): AggregatorV6Account {
    const data = account instanceof Uint8Array ? account : account.data;
    if (TOKEN_LEDGER_ACCOUNT_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Account.TokenLedger;
    throw new Error('Failed to identify AggregatorV6 account');
}

export enum AggregatorV6Instruction {
    Claim,
    ClaimToken,
    CloseToken,
    CreateTokenLedger,
    CreateTokenAccount,
    CloseWsolTokenAccount,
    ExactOutRoute,
    Route,
    RouteWithTokenLedger,
    SetTokenLedger,
    SharedAccountsExactOutRoute,
    SharedAccountsRoute,
    SharedAccountsRouteWithTokenLedger,
    ExactOutRouteV2,
    RouteV2,
    SharedAccountsExactOutRouteV2,
    SharedAccountsRouteV2,
}

export function identifyAggregatorV6Instruction(
    instruction: { data: Uint8Array } | Uint8Array,
): AggregatorV6Instruction {
    const data = instruction instanceof Uint8Array ? instruction : instruction.data;
    if (CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.Claim;
    if (CLAIM_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.ClaimToken;
    if (CLOSE_TOKEN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.CloseToken;
    if (CREATE_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.CreateTokenLedger;
    if (CREATE_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.CreateTokenAccount;
    if (CLOSE_WSOL_TOKEN_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.CloseWsolTokenAccount;
    if (EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.ExactOutRoute;
    if (ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.Route;
    if (ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.RouteWithTokenLedger;
    if (SET_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.SetTokenLedger;
    if (SHARED_ACCOUNTS_EXACT_OUT_ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.SharedAccountsExactOutRoute;
    if (SHARED_ACCOUNTS_ROUTE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.SharedAccountsRoute;
    if (
        SHARED_ACCOUNTS_ROUTE_WITH_TOKEN_LEDGER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => data[0 + index] === byte,
        )
    )
        return AggregatorV6Instruction.SharedAccountsRouteWithTokenLedger;
    if (EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.ExactOutRouteV2;
    if (ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.RouteV2;
    if (SHARED_ACCOUNTS_EXACT_OUT_ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.SharedAccountsExactOutRouteV2;
    if (SHARED_ACCOUNTS_ROUTE_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => data[0 + index] === byte))
        return AggregatorV6Instruction.SharedAccountsRouteV2;
    throw new Error('Failed to identify AggregatorV6 instruction');
}

export type ParsedAggregatorV6Instruction =
    | ({ instructionType: AggregatorV6Instruction.Claim } & ParsedClaimInstruction)
    | ({ instructionType: AggregatorV6Instruction.ClaimToken } & ParsedClaimTokenInstruction)
    | ({ instructionType: AggregatorV6Instruction.CloseToken } & ParsedCloseTokenInstruction)
    | ({ instructionType: AggregatorV6Instruction.CreateTokenLedger } & ParsedCreateTokenLedgerInstruction)
    | ({ instructionType: AggregatorV6Instruction.CreateTokenAccount } & ParsedCreateTokenAccountInstruction)
    | ({ instructionType: AggregatorV6Instruction.CloseWsolTokenAccount } & ParsedCloseWsolTokenAccountInstruction)
    | ({ instructionType: AggregatorV6Instruction.ExactOutRoute } & ParsedExactOutRouteInstruction)
    | ({ instructionType: AggregatorV6Instruction.Route } & ParsedRouteInstruction)
    | ({ instructionType: AggregatorV6Instruction.RouteWithTokenLedger } & ParsedRouteWithTokenLedgerInstruction)
    | ({ instructionType: AggregatorV6Instruction.SetTokenLedger } & ParsedSetTokenLedgerInstruction)
    | ({
          instructionType: AggregatorV6Instruction.SharedAccountsExactOutRoute;
      } & ParsedSharedAccountsExactOutRouteInstruction)
    | ({ instructionType: AggregatorV6Instruction.SharedAccountsRoute } & ParsedSharedAccountsRouteInstruction)
    | ({
          instructionType: AggregatorV6Instruction.SharedAccountsRouteWithTokenLedger;
      } & ParsedSharedAccountsRouteWithTokenLedgerInstruction)
    | ({ instructionType: AggregatorV6Instruction.ExactOutRouteV2 } & ParsedExactOutRouteV2Instruction)
    | ({ instructionType: AggregatorV6Instruction.RouteV2 } & ParsedRouteV2Instruction)
    | ({
          instructionType: AggregatorV6Instruction.SharedAccountsExactOutRouteV2;
      } & ParsedSharedAccountsExactOutRouteV2Instruction)
    | ({ instructionType: AggregatorV6Instruction.SharedAccountsRouteV2 } & ParsedSharedAccountsRouteV2Instruction);

export function parseAggregatorV6Instruction(instruction: TransactionInstruction): ParsedAggregatorV6Instruction {
    const instructionType = identifyAggregatorV6Instruction(instruction);
    switch (instructionType) {
        case AggregatorV6Instruction.Claim:
            return {
                instructionType,
                ...parseClaimInstruction(instruction),
            };
        case AggregatorV6Instruction.ClaimToken:
            return {
                instructionType,
                ...parseClaimTokenInstruction(instruction),
            };
        case AggregatorV6Instruction.CloseToken:
            return {
                instructionType,
                ...parseCloseTokenInstruction(instruction),
            };
        case AggregatorV6Instruction.CreateTokenLedger:
            return {
                instructionType,
                ...parseCreateTokenLedgerInstruction(instruction),
            };
        case AggregatorV6Instruction.CreateTokenAccount:
            return {
                instructionType,
                ...parseCreateTokenAccountInstruction(instruction),
            };
        case AggregatorV6Instruction.CloseWsolTokenAccount:
            return {
                instructionType,
                ...parseCloseWsolTokenAccountInstruction(instruction),
            };
        case AggregatorV6Instruction.ExactOutRoute:
            return {
                instructionType,
                ...parseExactOutRouteInstruction(instruction),
            };
        case AggregatorV6Instruction.Route:
            return {
                instructionType,
                ...parseRouteInstruction(instruction),
            };
        case AggregatorV6Instruction.RouteWithTokenLedger:
            return {
                instructionType,
                ...parseRouteWithTokenLedgerInstruction(instruction),
            };
        case AggregatorV6Instruction.SetTokenLedger:
            return {
                instructionType,
                ...parseSetTokenLedgerInstruction(instruction),
            };
        case AggregatorV6Instruction.SharedAccountsExactOutRoute:
            return {
                instructionType,
                ...parseSharedAccountsExactOutRouteInstruction(instruction),
            };
        case AggregatorV6Instruction.SharedAccountsRoute:
            return {
                instructionType,
                ...parseSharedAccountsRouteInstruction(instruction),
            };
        case AggregatorV6Instruction.SharedAccountsRouteWithTokenLedger:
            return {
                instructionType,
                ...parseSharedAccountsRouteWithTokenLedgerInstruction(instruction),
            };
        case AggregatorV6Instruction.ExactOutRouteV2:
            return {
                instructionType,
                ...parseExactOutRouteV2Instruction(instruction),
            };
        case AggregatorV6Instruction.RouteV2:
            return {
                instructionType,
                ...parseRouteV2Instruction(instruction),
            };
        case AggregatorV6Instruction.SharedAccountsExactOutRouteV2:
            return {
                instructionType,
                ...parseSharedAccountsExactOutRouteV2Instruction(instruction),
            };
        case AggregatorV6Instruction.SharedAccountsRouteV2:
            return {
                instructionType,
                ...parseSharedAccountsRouteV2Instruction(instruction),
            };
    }
}
