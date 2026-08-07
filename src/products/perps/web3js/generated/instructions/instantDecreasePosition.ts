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

export const INSTANT_DECREASE_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([46, 23, 240, 44, 30, 138, 94, 140]);

export interface InstantDecreasePositionInstructionAccounts {
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
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyPythnetPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    desiredMint: Address;
    referral?: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantDecreasePositionInstructionArgs {
    collateralUsdDelta: number | bigint;
    sizeUsdDelta: number | bigint;
    priceSlippage: number | bigint;
    entirePosition: OptionOrNullable<boolean>;
    requestTime: number | bigint;
}

function getInstantDecreasePositionInstructionDataEncoder(): Encoder<InstantDecreasePositionInstructionArgs> {
    return getStructEncoder([
        ['collateralUsdDelta', getU64Encoder()],
        ['sizeUsdDelta', getU64Encoder()],
        ['priceSlippage', getU64Encoder()],
        ['entirePosition', getOptionEncoder(getBooleanEncoder())],
        ['requestTime', getI64Encoder()],
    ]);
}

function getInstantDecreasePositionInstructionDataDecoder(): Decoder<InstantDecreasePositionInstructionArgs> {
    return getStructDecoder([
        ['collateralUsdDelta', getU64Decoder()],
        ['sizeUsdDelta', getU64Decoder()],
        ['priceSlippage', getU64Decoder()],
        ['entirePosition', getOptionDecoder(getBooleanDecoder())],
        ['requestTime', getI64Decoder()],
    ]);
}

export interface ParsedInstantDecreasePositionInstruction {
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
        custodyPythnetPriceAccount: AccountMeta;
        collateralCustody: AccountMeta;
        collateralCustodyDovesPriceAccount: AccountMeta;
        collateralCustodyPythnetPriceAccount: AccountMeta;
        collateralCustodyTokenAccount: AccountMeta;
        desiredMint: AccountMeta;
        referral: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: InstantDecreasePositionInstructionArgs;
}

export function parseInstantDecreasePositionInstruction(
    instruction: TransactionInstruction,
): ParsedInstantDecreasePositionInstruction {
    if (instruction.keys.length < 22) {
        throw new Error('Expected 22 account metas for InstantDecreasePosition instruction');
    }
    if (
        !INSTANT_DECREASE_POSITION_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InstantDecreasePosition instruction discriminator mismatch');
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
            custodyPythnetPriceAccount: instruction.keys[10]!,
            collateralCustody: instruction.keys[11]!,
            collateralCustodyDovesPriceAccount: instruction.keys[12]!,
            collateralCustodyPythnetPriceAccount: instruction.keys[13]!,
            collateralCustodyTokenAccount: instruction.keys[14]!,
            desiredMint: instruction.keys[15]!,
            referral: instruction.keys[16]!,
            tokenProgram: instruction.keys[17]!,
            associatedTokenProgram: instruction.keys[18]!,
            systemProgram: instruction.keys[19]!,
            eventAuthority: instruction.keys[20]!,
            program: instruction.keys[21]!,
        },
        data: getInstantDecreasePositionInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantDecreasePositionInstruction(
    accounts: InstantDecreasePositionInstructionAccounts,
    args: InstantDecreasePositionInstructionArgs,
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
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
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
    let data = Buffer.from(getInstantDecreasePositionInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_DECREASE_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
