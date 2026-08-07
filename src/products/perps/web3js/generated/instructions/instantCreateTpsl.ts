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

export const INSTANT_CREATE_TPSL_INSTRUCTION_DISCRIMINATOR = new Uint8Array([117, 98, 66, 127, 30, 50, 73, 185]);

export interface InstantCreateTpslInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
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

export interface InstantCreateTpslInstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    triggerPrice: number | bigint;
    triggerAboveThreshold: boolean;
    entirePosition: boolean;
    counter: number | bigint;
    requestTime: number | bigint;
}

function getInstantCreateTpslInstructionDataEncoder(): Encoder<InstantCreateTpslInstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['triggerPrice', getU64Encoder()],
        ['triggerAboveThreshold', getBooleanEncoder()],
        ['entirePosition', getBooleanEncoder()],
        ['counter', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

function getInstantCreateTpslInstructionDataDecoder(): Decoder<InstantCreateTpslInstructionArgs> {
    return getStructDecoder([
        ['collateralUsdDelta', getU64Decoder()],
        ['sizeUsdDelta', getU64Decoder()],
        ['triggerPrice', getU64Decoder()],
        ['triggerAboveThreshold', getBooleanDecoder()],
        ['entirePosition', getBooleanDecoder()],
        ['counter', getU64Decoder()],
        ['requestTime', getI64Decoder()],
    ]);
}

export interface ParsedInstantCreateTpslInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        apiKeeper: AccountMeta;
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
    data: InstantCreateTpslInstructionArgs;
}

export function parseInstantCreateTpslInstruction(
    instruction: TransactionInstruction,
): ParsedInstantCreateTpslInstruction {
    if (instruction.keys.length < 20) {
        throw new Error('Expected 20 account metas for InstantCreateTpsl instruction');
    }
    if (!INSTANT_CREATE_TPSL_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InstantCreateTpsl instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            apiKeeper: instruction.keys[1]!,
            owner: instruction.keys[2]!,
            receivingAccount: instruction.keys[3]!,
            perpetuals: instruction.keys[4]!,
            pool: instruction.keys[5]!,
            position: instruction.keys[6]!,
            positionRequest: instruction.keys[7]!,
            positionRequestAta: instruction.keys[8]!,
            custody: instruction.keys[9]!,
            custodyDovesPriceAccount: instruction.keys[10]!,
            custodyPythnetPriceAccount: instruction.keys[11]!,
            collateralCustody: instruction.keys[12]!,
            desiredMint: instruction.keys[13]!,
            referral: instruction.keys[14]!,
            tokenProgram: instruction.keys[15]!,
            associatedTokenProgram: instruction.keys[16]!,
            systemProgram: instruction.keys[17]!,
            eventAuthority: instruction.keys[18]!,
            program: instruction.keys[19]!,
        },
        data: getInstantCreateTpslInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantCreateTpslInstruction(
    accounts: InstantCreateTpslInstructionAccounts,
    args: InstantCreateTpslInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
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
    let data = Buffer.from(getInstantCreateTpslInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_CREATE_TPSL_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
