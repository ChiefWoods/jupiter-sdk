import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INSTANT_INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    197, 38, 86, 165, 199, 23, 38, 234,
]);

export interface InstantIncreasePositionPreSwapInstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    receivingAccount: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    receivingCustody: Address;
    receivingCustodyDovesPriceAccount: Address;
    receivingCustodyTokenAccount: Address;
    dispensingCustody: Address;
    dispensingCustodyDovesPriceAccount: Address;
    dispensingCustodyTokenAccount: Address;
    tokenProgram: Address;
    instructionSysvar: Address;
    eventAuthority: Address;
    program: Address;
}

export interface InstantIncreasePositionPreSwapInstructionArgs {
    amountIn: number | bigint;
    minAmountOut: number | bigint;
}

function getInstantIncreasePositionPreSwapInstructionDataEncoder(): Encoder<InstantIncreasePositionPreSwapInstructionArgs> {
    return getStructEncoder([
        ['amountIn', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

function getInstantIncreasePositionPreSwapInstructionDataDecoder(): Decoder<InstantIncreasePositionPreSwapInstructionArgs> {
    return getStructDecoder([
        ['amountIn', getU64Decoder()],
        ['minAmountOut', getU64Decoder()],
    ]);
}

export interface ParsedInstantIncreasePositionPreSwapInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        fundingAccount: AccountMeta;
        receivingAccount: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        receivingCustody: AccountMeta;
        receivingCustodyDovesPriceAccount: AccountMeta;
        receivingCustodyTokenAccount: AccountMeta;
        dispensingCustody: AccountMeta;
        dispensingCustodyDovesPriceAccount: AccountMeta;
        dispensingCustodyTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        instructionSysvar: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: InstantIncreasePositionPreSwapInstructionArgs;
}

export function parseInstantIncreasePositionPreSwapInstruction(
    instruction: TransactionInstruction,
): ParsedInstantIncreasePositionPreSwapInstruction {
    if (instruction.keys.length < 16) {
        throw new Error('Expected 16 account metas for InstantIncreasePositionPreSwap instruction');
    }
    if (
        !INSTANT_INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('InstantIncreasePositionPreSwap instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            fundingAccount: instruction.keys[1]!,
            receivingAccount: instruction.keys[2]!,
            transferAuthority: instruction.keys[3]!,
            perpetuals: instruction.keys[4]!,
            pool: instruction.keys[5]!,
            receivingCustody: instruction.keys[6]!,
            receivingCustodyDovesPriceAccount: instruction.keys[7]!,
            receivingCustodyTokenAccount: instruction.keys[8]!,
            dispensingCustody: instruction.keys[9]!,
            dispensingCustodyDovesPriceAccount: instruction.keys[10]!,
            dispensingCustodyTokenAccount: instruction.keys[11]!,
            tokenProgram: instruction.keys[12]!,
            instructionSysvar: instruction.keys[13]!,
            eventAuthority: instruction.keys[14]!,
            program: instruction.keys[15]!,
        },
        data: getInstantIncreasePositionPreSwapInstructionDataDecoder().decode(instructionData),
    };
}

export function createInstantIncreasePositionPreSwapInstruction(
    accounts: InstantIncreasePositionPreSwapInstructionAccounts,
    args: InstantIncreasePositionPreSwapInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.receivingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.dispensingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.instructionSysvar, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInstantIncreasePositionPreSwapInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INSTANT_INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
