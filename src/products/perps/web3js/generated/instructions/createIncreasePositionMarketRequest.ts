import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { getSideDecoder, getSideEncoder, type SideArgs } from '../types/side';

export const CREATE_INCREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    184, 85, 199, 24, 105, 171, 156, 56,
]);

export interface CreateIncreasePositionMarketRequestInstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    collateralCustody: Address;
    inputMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateIncreasePositionMarketRequestInstructionArgs {
    sizeUsdDelta: number | bigint;
    collateralTokenDelta: number | bigint;
    side: SideArgs;
    priceSlippage: number | bigint;
    jupiterMinimumOut: OptionOrNullable<number | bigint>;
    counter: number | bigint;
}

function getCreateIncreasePositionMarketRequestInstructionDataEncoder(): Encoder<CreateIncreasePositionMarketRequestInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['collateralTokenDelta', getU64Encoder()],
        ['side', getSideEncoder()],
        ['priceSlippage', getU64Encoder()],
        ['jupiterMinimumOut', getOptionEncoder(getU64Encoder())],
        ['counter', getU64Encoder()],
    ]);
}

function getCreateIncreasePositionMarketRequestInstructionDataDecoder(): Decoder<CreateIncreasePositionMarketRequestInstructionArgs> {
    return getStructDecoder([
        ['sizeUsdDelta', getU64Decoder()],
        ['collateralTokenDelta', getU64Decoder()],
        ['side', getSideDecoder()],
        ['priceSlippage', getU64Decoder()],
        ['jupiterMinimumOut', getOptionDecoder(getU64Decoder())],
        ['counter', getU64Decoder()],
    ]);
}

export interface ParsedCreateIncreasePositionMarketRequestInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        fundingAccount: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        custody: AccountMeta;
        collateralCustody: AccountMeta;
        inputMint: AccountMeta;
        referral: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateIncreasePositionMarketRequestInstructionArgs;
}

export function parseCreateIncreasePositionMarketRequestInstruction(
    instruction: TransactionInstruction,
): ParsedCreateIncreasePositionMarketRequestInstruction {
    if (instruction.keys.length < 16) {
        throw new Error('Expected 16 account metas for CreateIncreasePositionMarketRequest instruction');
    }
    if (
        !CREATE_INCREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateIncreasePositionMarketRequest instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            fundingAccount: instruction.keys[1]!,
            perpetuals: instruction.keys[2]!,
            pool: instruction.keys[3]!,
            position: instruction.keys[4]!,
            positionRequest: instruction.keys[5]!,
            positionRequestAta: instruction.keys[6]!,
            custody: instruction.keys[7]!,
            collateralCustody: instruction.keys[8]!,
            inputMint: instruction.keys[9]!,
            referral: instruction.keys[10]!,
            tokenProgram: instruction.keys[11]!,
            associatedTokenProgram: instruction.keys[12]!,
            systemProgram: instruction.keys[13]!,
            eventAuthority: instruction.keys[14]!,
            program: instruction.keys[15]!,
        },
        data: getCreateIncreasePositionMarketRequestInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateIncreasePositionMarketRequestInstruction(
    accounts: CreateIncreasePositionMarketRequestInstructionAccounts,
    args: CreateIncreasePositionMarketRequestInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: false },
        { pubkey: accounts.inputMint, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateIncreasePositionMarketRequestInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_INCREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
