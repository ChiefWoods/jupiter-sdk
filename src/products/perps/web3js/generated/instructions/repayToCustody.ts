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

export const REPAY_TO_CUSTODY_INSTRUCTION_DISCRIMINATOR = new Uint8Array([211, 219, 183, 222, 248, 74, 5, 26]);

export interface RepayToCustodyInstructionAccounts {
    owner: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    borrowPosition: Address;
    custodyTokenAccount: Address;
    userTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface RepayToCustodyInstructionArgs {
    amount: number | bigint;
}

function getRepayToCustodyInstructionDataEncoder(): Encoder<RepayToCustodyInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getRepayToCustodyInstructionDataDecoder(): Decoder<RepayToCustodyInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedRepayToCustodyInstruction {
    programId: Address;
    accounts: {
        owner: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        borrowPosition: AccountMeta;
        custodyTokenAccount: AccountMeta;
        userTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: RepayToCustodyInstructionArgs;
}

export function parseRepayToCustodyInstruction(instruction: TransactionInstruction): ParsedRepayToCustodyInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for RepayToCustody instruction');
    }
    if (!REPAY_TO_CUSTODY_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RepayToCustody instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            owner: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            borrowPosition: instruction.keys[4]!,
            custodyTokenAccount: instruction.keys[5]!,
            userTokenAccount: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: getRepayToCustodyInstructionDataDecoder().decode(instructionData),
    };
}

export function createRepayToCustodyInstruction(
    accounts: RepayToCustodyInstructionAccounts,
    args: RepayToCustodyInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowPosition, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRepayToCustodyInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REPAY_TO_CUSTODY_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
