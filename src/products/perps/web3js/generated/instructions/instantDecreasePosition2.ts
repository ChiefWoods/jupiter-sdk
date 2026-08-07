import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getI64Decoder,
    getI64Encoder,
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

export const INSTANT_DECREASE_POSITION2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    162, 191, 200, 62, 139, 62, 176, 17,
]);

export interface InstantDecreasePosition2InstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    receivingAccount: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    position: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    desiredMint: Address;
    referral?: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantDecreasePosition2InstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    priceSlippage: number | bigint;
    entirePosition: OptionOrNullable<boolean>;
    requestTime: number | bigint;
    counter: number | bigint;
}

function getInstantDecreasePosition2InstructionDataEncoder(): Encoder<InstantDecreasePosition2InstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['priceSlippage', getU64Encoder()],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['requestTime', getI64Encoder()],
        ['counter', getU64Encoder()],
    ]);
}

function getInstantDecreasePosition2InstructionDataDecoder(): Decoder<InstantDecreasePosition2InstructionArgs> {
    return getStructDecoder([
        ['collateralUsdDelta', getU64Decoder()],
        ['sizeUsdDelta', getU64Decoder()],
        ['priceSlippage', getU64Decoder()],
        ['entirePosition', getOptionDecoder(getBooleanDecoder())],
        ['requestTime', getI64Decoder()],
        ['counter', getU64Decoder()],
    ]);
}

export interface ParsedInstantDecreasePosition2Instruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        apiKeeper: AccountMeta;
        owner: AccountMeta;
        receivingAccount: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        position: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        collateralCustody: AccountMeta;
        collateralCustodyDovesPriceAccount: AccountMeta;
        collateralCustodyTokenAccount: AccountMeta;
        desiredMint: AccountMeta;
        referral: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: InstantDecreasePosition2InstructionArgs;
}

export function parseInstantDecreasePosition2Instruction(
    instruction: TransactionInstruction,
): ParsedInstantDecreasePosition2Instruction {
    if (instruction.keys.length < 22) {
        throw new Error('Expected 22 account metas for InstantDecreasePosition2 instruction');
    }
    if (
        !INSTANT_DECREASE_POSITION2_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InstantDecreasePosition2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            apiKeeper: instruction.keys[1]!,
            owner: instruction.keys[2]!,
            receivingAccount: instruction.keys[3]!,
            transferAuthority: instruction.keys[4]!,
            perpetuals: instruction.keys[5]!,
            pool: instruction.keys[6]!,
            position: instruction.keys[7]!,
            custody: instruction.keys[8]!,
            custodyDovesPriceAccount: instruction.keys[9]!,
            collateralCustody: instruction.keys[10]!,
            collateralCustodyDovesPriceAccount: instruction.keys[11]!,
            collateralCustodyTokenAccount: instruction.keys[12]!,
            desiredMint: instruction.keys[13]!,
            referral: instruction.keys[14]!,
            positionRequest: instruction.keys[15]!,
            positionRequestAta: instruction.keys[16]!,
            tokenProgram: instruction.keys[17]!,
            associatedTokenProgram: instruction.keys[18]!,
            systemProgram: instruction.keys[19]!,
            eventAuthority: instruction.keys[20]!,
            program: instruction.keys[21]!,
        },
        data: getInstantDecreasePosition2InstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantDecreasePosition2Instruction(
    accounts: InstantDecreasePosition2InstructionAccounts,
    args: InstantDecreasePosition2InstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.desiredMint, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInstantDecreasePosition2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_DECREASE_POSITION2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
