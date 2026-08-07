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

export const SWAP2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([65, 75, 63, 76, 235, 91, 91, 136]);

export interface Swap2InstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    receivingAccount: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    receivingCustody: Address;
    receivingCustodyDovesPriceAccount: Address;
    receivingCustodyPythnetPriceAccount: Address;
    receivingCustodyTokenAccount: Address;
    dispensingCustody: Address;
    dispensingCustodyDovesPriceAccount: Address;
    dispensingCustodyPythnetPriceAccount: Address;
    dispensingCustodyTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface Swap2InstructionArgs {
    amountIn: number | bigint;
    minAmountOut: number | bigint;
}

function getSwap2InstructionDataEncoder(): Encoder<Swap2InstructionArgs> {
    return getStructEncoder([
        ['amountIn', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

function getSwap2InstructionDataDecoder(): Decoder<Swap2InstructionArgs> {
    return getStructDecoder([
        ['amountIn', getU64Decoder()],
        ['minAmountOut', getU64Decoder()],
    ]);
}

export interface ParsedSwap2Instruction {
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
        receivingCustodyPythnetPriceAccount: AccountMeta;
        receivingCustodyTokenAccount: AccountMeta;
        dispensingCustody: AccountMeta;
        dispensingCustodyDovesPriceAccount: AccountMeta;
        dispensingCustodyPythnetPriceAccount: AccountMeta;
        dispensingCustodyTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: Swap2InstructionArgs;
}

export function parseSwap2Instruction(instruction: TransactionInstruction): ParsedSwap2Instruction {
    if (instruction.keys.length < 17) {
        throw new Error('Expected 17 account metas for Swap2 instruction');
    }
    if (!SWAP2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Swap2 instruction discriminator mismatch');
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
            receivingCustodyPythnetPriceAccount: instruction.keys[8]!,
            receivingCustodyTokenAccount: instruction.keys[9]!,
            dispensingCustody: instruction.keys[10]!,
            dispensingCustodyDovesPriceAccount: instruction.keys[11]!,
            dispensingCustodyPythnetPriceAccount: instruction.keys[12]!,
            dispensingCustodyTokenAccount: instruction.keys[13]!,
            tokenProgram: instruction.keys[14]!,
            eventAuthority: instruction.keys[15]!,
            program: instruction.keys[16]!,
        },
        data: getSwap2InstructionDataDecoder().decode(instructionData),
    };
}

export function createSwap2Instruction(
    accounts: Swap2InstructionAccounts,
    args: Swap2InstructionArgs,
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
        { pubkey: accounts.receivingCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.receivingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.dispensingCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.dispensingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getSwap2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(SWAP2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
