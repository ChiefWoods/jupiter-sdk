import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const CLOSE_POSITION_REQUEST3_INSTRUCTION_DISCRIMINATOR = new Uint8Array([122, 130, 33, 18, 211, 44, 161, 58]);

export interface ClosePositionRequest3InstructionAccounts {
    keeper?: Address;
    owner: Address;
    ownerAta: Address;
    pool: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    position: Address;
    custody: Address;
    mint: Address;
    tokenProgram: Address;
    systemProgram: Address;
    associatedTokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedClosePositionRequest3Instruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        owner: AccountMeta;
        ownerAta: AccountMeta;
        pool: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        position: AccountMeta;
        custody: AccountMeta;
        mint: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseClosePositionRequest3Instruction(
    instruction: TransactionInstruction,
): ParsedClosePositionRequest3Instruction {
    if (instruction.keys.length < 14) {
        throw new Error('Expected 14 account metas for ClosePositionRequest3 instruction');
    }
    if (
        !CLOSE_POSITION_REQUEST3_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('ClosePositionRequest3 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            ownerAta: instruction.keys[2]!,
            pool: instruction.keys[3]!,
            positionRequest: instruction.keys[4]!,
            positionRequestAta: instruction.keys[5]!,
            position: instruction.keys[6]!,
            custody: instruction.keys[7]!,
            mint: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            systemProgram: instruction.keys[10]!,
            associatedTokenProgram: instruction.keys[11]!,
            eventAuthority: instruction.keys[12]!,
            program: instruction.keys[13]!,
        },
        data: {},
    };
}

export function createClosePositionRequest3Instruction(
    accounts: ClosePositionRequest3InstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        accounts.keeper
            ? { pubkey: accounts.keeper, isSigner: true, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.owner, isSigner: false, isWritable: true },
        { pubkey: accounts.ownerAta, isSigner: false, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLOSE_POSITION_REQUEST3_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
