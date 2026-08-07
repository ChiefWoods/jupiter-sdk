import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
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
import { getSideDecoder, getSideEncoder, type SideArgs } from '../types/side';

export const INSTANT_INCREASE_POSITION_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    164, 126, 68, 182, 223, 166, 64, 183,
]);

export interface InstantIncreasePositionInstructionAccounts {
    keeper: Address;
    apiKeeper: Address;
    owner: Address;
    fundingAccount: Address;
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
    tokenLedger?: Address;
    referral?: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantIncreasePositionInstructionArgs {
    sizeUsdDelta: number | bigint;
    collateralTokenDelta: OptionOrNullable<number | bigint>;
    side: SideArgs;
    priceSlippage: number | bigint;
    requestTime: number | bigint;
}

function getInstantIncreasePositionInstructionDataEncoder(): Encoder<InstantIncreasePositionInstructionArgs> {
    return getStructEncoder([
        ['sizeUsdDelta', getU64Encoder()],
        ['collateralTokenDelta', getOptionEncoder(getU64Encoder())],
        ['side', getSideEncoder()],
        ['priceSlippage', getU64Encoder()],
        ['requestTime', getI64Encoder()],
    ]);
}

function getInstantIncreasePositionInstructionDataDecoder(): Decoder<InstantIncreasePositionInstructionArgs> {
    return getStructDecoder([
        ['sizeUsdDelta', getU64Decoder()],
        ['collateralTokenDelta', getOptionDecoder(getU64Decoder())],
        ['side', getSideDecoder()],
        ['priceSlippage', getU64Decoder()],
        ['requestTime', getI64Decoder()],
    ]);
}

export interface ParsedInstantIncreasePositionInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        apiKeeper: AccountMeta;
        owner: AccountMeta;
        fundingAccount: AccountMeta;
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
        tokenLedger: AccountMeta;
        referral: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: InstantIncreasePositionInstructionArgs;
}

export function parseInstantIncreasePositionInstruction(
    instruction: TransactionInstruction,
): ParsedInstantIncreasePositionInstruction {
    if (instruction.keys.length < 20) {
        throw new Error('Expected 20 account metas for InstantIncreasePosition instruction');
    }
    if (
        !INSTANT_INCREASE_POSITION_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InstantIncreasePosition instruction discriminator mismatch');
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
            custody: instruction.keys[7]!,
            custodyDovesPriceAccount: instruction.keys[8]!,
            custodyPythnetPriceAccount: instruction.keys[9]!,
            collateralCustody: instruction.keys[10]!,
            collateralCustodyDovesPriceAccount: instruction.keys[11]!,
            collateralCustodyPythnetPriceAccount: instruction.keys[12]!,
            collateralCustodyTokenAccount: instruction.keys[13]!,
            tokenLedger: instruction.keys[14]!,
            referral: instruction.keys[15]!,
            tokenProgram: instruction.keys[16]!,
            systemProgram: instruction.keys[17]!,
            eventAuthority: instruction.keys[18]!,
            program: instruction.keys[19]!,
        },
        data: getInstantIncreasePositionInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantIncreasePositionInstruction(
    accounts: InstantIncreasePositionInstructionAccounts,
    args: InstantIncreasePositionInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.apiKeeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
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
        accounts.tokenLedger
            ? { pubkey: accounts.tokenLedger, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.referral
            ? { pubkey: accounts.referral, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInstantIncreasePositionInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_INCREASE_POSITION_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
