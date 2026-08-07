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
import { getRequestTypeDecoder, getRequestTypeEncoder, type RequestTypeArgs } from '../types/requestType';

export const CREATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    105, 64, 201, 82, 250, 14, 109, 77,
]);

export interface CreateDecreasePositionRequest2InstructionAccounts {
    owner: Address;
    receivingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    desiredMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface CreateDecreasePositionRequest2InstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    requestType: RequestTypeArgs;
    priceSlippage: OptionOrNullable<number | bigint>;
    jupiterMinimumOut: OptionOrNullable<number | bigint>;
    triggerPrice: OptionOrNullable<number | bigint>;
    triggerAboveThreshold: OptionOrNullable<boolean>;
    entirePosition: OptionOrNullable<boolean>;
    counter: number | bigint;
}

function getCreateDecreasePositionRequest2InstructionDataEncoder(): Encoder<CreateDecreasePositionRequest2InstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['requestType', getRequestTypeEncoder()],
        ['priceSlippage', getOptionEncoder(getU64Encoder())],
        ['jupiterMinimumOut', getOptionEncoder(getU64Encoder())],
        ['triggerPrice', getOptionEncoder(getU64Encoder())],
        ['triggerAboveThreshold', getOptionEncoder(getBooleanEncoder())],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['counter', getU64Encoder()],
    ]);
}

function getCreateDecreasePositionRequest2InstructionDataDecoder(): Decoder<CreateDecreasePositionRequest2InstructionArgs> {
    return getStructDecoder([
        ['collateralUsdDelta', getU64Decoder()],
        ['sizeUsdDelta', getU64Decoder()],
        ['requestType', getRequestTypeDecoder()],
        ['priceSlippage', getOptionDecoder(getU64Decoder())],
        ['jupiterMinimumOut', getOptionDecoder(getU64Decoder())],
        ['triggerPrice', getOptionDecoder(getU64Decoder())],
        ['triggerAboveThreshold', getOptionDecoder(getBooleanDecoder())],
        ['entirePosition', getOptionDecoder(getBooleanDecoder())],
        ['counter', getU64Decoder()],
    ]);
}

export interface ParsedCreateDecreasePositionRequest2Instruction {
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
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        collateralCustody: AccountMeta;
        desiredMint: AccountMeta;
        referral: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateDecreasePositionRequest2InstructionArgs;
}

export function parseCreateDecreasePositionRequest2Instruction(
    instruction: TransactionInstruction,
): ParsedCreateDecreasePositionRequest2Instruction {
    if (instruction.keys.length < 18) {
        throw new Error('Expected 18 account metas for CreateDecreasePositionRequest2 instruction');
    }
    if (
        !CREATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateDecreasePositionRequest2 instruction discriminator mismatch');
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
            custodyDovesPriceAccount: instruction.keys[8]!,
            custodyPythnetPriceAccount: instruction.keys[9]!,
            collateralCustody: instruction.keys[10]!,
            desiredMint: instruction.keys[11]!,
            referral: instruction.keys[12]!,
            tokenProgram: instruction.keys[13]!,
            associatedTokenProgram: instruction.keys[14]!,
            systemProgram: instruction.keys[15]!,
            eventAuthority: instruction.keys[16]!,
            program: instruction.keys[17]!,
        },
        data: getCreateDecreasePositionRequest2InstructionDataDecoder().decode(instructionData),
    };
}

export function createCreateDecreasePositionRequest2Instruction(
    accounts: CreateDecreasePositionRequest2InstructionAccounts,
    args: CreateDecreasePositionRequest2InstructionArgs,
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
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
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
    let data = Buffer.from(getCreateDecreasePositionRequest2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_DECREASE_POSITION_REQUEST2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
