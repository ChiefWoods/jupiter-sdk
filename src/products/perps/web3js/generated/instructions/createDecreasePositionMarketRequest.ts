import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getBooleanDecoder,
    getBooleanEncoder,
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

export const CREATE_DECREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    74, 198, 195, 86, 193, 99, 1, 79,
]);

export interface CreateDecreasePositionMarketRequestInstructionAccounts {
    owner: Address;
    receivingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    collateralCustody: Address;
    desiredMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateDecreasePositionMarketRequestInstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    priceSlippage: number | bigint;
    jupiterMinimumOut: OptionOrNullable<number | bigint>;
    entirePosition: OptionOrNullable<boolean>;
    counter: number | bigint;
}

function getCreateDecreasePositionMarketRequestInstructionDataEncoder(): Encoder<CreateDecreasePositionMarketRequestInstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['priceSlippage', getU64Encoder()],
        ['jupiterMinimumOut', getOptionEncoder(getU64Encoder())],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['counter', getU64Encoder()],
    ]);
}

function getCreateDecreasePositionMarketRequestInstructionDataDecoder(): Decoder<CreateDecreasePositionMarketRequestInstructionArgs> {
    return getStructDecoder([
        ['collateralUsdDelta', getU64Decoder()],
        ['sizeUsdDelta', getU64Decoder()],
        ['priceSlippage', getU64Decoder()],
        ['jupiterMinimumOut', getOptionDecoder(getU64Decoder())],
        ['entirePosition', getOptionDecoder(getBooleanDecoder())],
        ['counter', getU64Decoder()],
    ]);
}

export interface ParsedCreateDecreasePositionMarketRequestInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        receivingAccount: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        custody: AccountMeta;
        collateralCustody: AccountMeta;
        desiredMint: AccountMeta;
        referral: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateDecreasePositionMarketRequestInstructionArgs;
}

export function parseCreateDecreasePositionMarketRequestInstruction(
    instruction: TransactionInstruction,
): ParsedCreateDecreasePositionMarketRequestInstruction {
    if (instruction.keys.length < 16) {
        throw new Error('Expected 16 account metas for CreateDecreasePositionMarketRequest instruction');
    }
    if (
        !CREATE_DECREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateDecreasePositionMarketRequest instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            receivingAccount: instruction.keys[1]!,
            perpetuals: instruction.keys[2]!,
            pool: instruction.keys[3]!,
            position: instruction.keys[4]!,
            positionRequest: instruction.keys[5]!,
            positionRequestAta: instruction.keys[6]!,
            custody: instruction.keys[7]!,
            collateralCustody: instruction.keys[8]!,
            desiredMint: instruction.keys[9]!,
            referral: instruction.keys[10]!,
            tokenProgram: instruction.keys[11]!,
            associatedTokenProgram: instruction.keys[12]!,
            systemProgram: instruction.keys[13]!,
            eventAuthority: instruction.keys[14]!,
            program: instruction.keys[15]!,
        },
        data: getCreateDecreasePositionMarketRequestInstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateDecreasePositionMarketRequestInstruction(
    accounts: CreateDecreasePositionMarketRequestInstructionAccounts,
    args: CreateDecreasePositionMarketRequestInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: false },
        { pubkey: accounts.desiredMint, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateDecreasePositionMarketRequestInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_DECREASE_POSITION_MARKET_REQUEST_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
