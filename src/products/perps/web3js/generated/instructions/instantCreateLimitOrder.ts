import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getI64Decoder,
    getI64Encoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';
import { getSideDecoder, getSideEncoder, type SideArgs } from '../types/side';

export const INSTANT_CREATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    194, 37, 195, 123, 40, 127, 126, 156,
]);

export interface InstantCreateLimitOrderInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    fundingAccount: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    inputMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantCreateLimitOrderInstructionArgs {
    sizeUsdDelta: number | bigint;
    collateralTokenDelta: number | bigint;
    side: SideArgs;
    triggerPrice: number | bigint;
    triggerAboveThreshold: boolean;
    counter: number | bigint;
    requestTime: number | bigint;
}

function getInstantCreateLimitOrderInstructionDataEncoder(): Encoder<InstantCreateLimitOrderInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['collateralTokenDelta', getU64Encoder()],
        ['side', getSideEncoder()],
        ['triggerPrice', getU64Encoder()],
        ['triggerAboveThreshold', getBooleanEncoder()],
        ['counter', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

function getInstantCreateLimitOrderInstructionDataDecoder(): Decoder<InstantCreateLimitOrderInstructionArgs> {
    return getStructDecoder([
        ['sizeUsdDelta', getU64Decoder()],
        ['collateralTokenDelta', getU64Decoder()],
        ['side', getSideDecoder()],
        ['triggerPrice', getU64Decoder()],
        ['triggerAboveThreshold', getBooleanDecoder()],
        ['counter', getU64Decoder()],
        ['requestTime', getI64Decoder()],
    ]);
}

export interface ParsedInstantCreateLimitOrderInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        apiKeeper: AccountMeta;
        owner: AccountMeta;
        fundingAccount: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        collateralCustody: AccountMeta;
        inputMint: AccountMeta;
        referral: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: InstantCreateLimitOrderInstructionArgs;
}

export function parseInstantCreateLimitOrderInstruction(
    instruction: TransactionInstruction,
): ParsedInstantCreateLimitOrderInstruction {
    if (instruction.keys.length < 20) {
        throw new Error('Expected 20 account metas for InstantCreateLimitOrder instruction');
    }
    if (
        !INSTANT_CREATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InstantCreateLimitOrder instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            apiKeeper: instruction.keys[1]!,
            owner: instruction.keys[2]!,
            fundingAccount: instruction.keys[3]!,
            perpetuals: instruction.keys[4]!,
            pool: instruction.keys[5]!,
            position: instruction.keys[6]!,
            positionRequest: instruction.keys[7]!,
            positionRequestAta: instruction.keys[8]!,
            custody: instruction.keys[9]!,
            custodyDovesPriceAccount: instruction.keys[10]!,
            custodyPythnetPriceAccount: instruction.keys[11]!,
            collateralCustody: instruction.keys[12]!,
            inputMint: instruction.keys[13]!,
            referral: instruction.keys[14]!,
            tokenProgram: instruction.keys[15]!,
            associatedTokenProgram: instruction.keys[16]!,
            systemProgram: instruction.keys[17]!,
            eventAuthority: instruction.keys[18]!,
            program: instruction.keys[19]!,
        },
        data: getInstantCreateLimitOrderInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantCreateLimitOrderInstruction(
    accounts: InstantCreateLimitOrderInstructionAccounts,
    args: InstantCreateLimitOrderInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
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
    let data = Buffer.from(getInstantCreateLimitOrderInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_CREATE_LIMIT_ORDER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
