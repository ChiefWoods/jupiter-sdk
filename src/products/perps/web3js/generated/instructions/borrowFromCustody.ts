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

export const BORROW_FROM_CUSTODY_INSTRUCTION_DISCRIMINATOR = new Uint8Array([153, 183, 65, 65, 113, 33, 249, 45]);

export interface BorrowFromCustodyInstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    transferAuthority: Address;
    borrowPosition: Address;
    custodyTokenAccount: Address;
    userTokenAccount: Address;
    lpTokenMint: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface BorrowFromCustodyInstructionArgs {
    amount: number | bigint;
}

function getBorrowFromCustodyInstructionDataEncoder(): Encoder<BorrowFromCustodyInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getBorrowFromCustodyInstructionDataDecoder(): Decoder<BorrowFromCustodyInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedBorrowFromCustodyInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        transferAuthority: AccountMeta;
        borrowPosition: AccountMeta;
        custodyTokenAccount: AccountMeta;
        userTokenAccount: AccountMeta;
        lpTokenMint: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: BorrowFromCustodyInstructionArgs;
}

export function parseBorrowFromCustodyInstruction(
    instruction: TransactionInstruction,
): ParsedBorrowFromCustodyInstruction {
    if (instruction.keys.length < 12) {
        throw new Error('Expected 12 account metas for BorrowFromCustody instruction');
    }
    if (!BORROW_FROM_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('BorrowFromCustody instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            transferAuthority: instruction.keys[4]!,
            borrowPosition: instruction.keys[5]!,
            custodyTokenAccount: instruction.keys[6]!,
            userTokenAccount: instruction.keys[7]!,
            lpTokenMint: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            eventAuthority: instruction.keys[10]!,
            program: instruction.keys[11]!,
        },
        data: getBorrowFromCustodyInstructionDataDecoder().decode(instructionData),
    };
}

export function createBorrowFromCustodyInstruction(
    accounts: BorrowFromCustodyInstructionAccounts,
    args: BorrowFromCustodyInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getBorrowFromCustodyInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(BORROW_FROM_CUSTODY_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
