import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR = new Uint8Array([26, 136, 225, 217, 22, 21, 83, 20]);

export interface IncreasePositionPreSwapInstructionAccounts {
    keeper: Address;
    keeperAta: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    position: Address;
    collateralCustody: Address;
    collateralCustodyTokenAccount: Address;
    instructionSysvar: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedIncreasePositionPreSwapInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        keeperAta: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        position: AccountMeta;
        collateralCustody: AccountMeta;
        collateralCustodyTokenAccount: AccountMeta;
        instructionSysvar: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseIncreasePositionPreSwapInstruction(
    instruction: TransactionInstruction,
): ParsedIncreasePositionPreSwapInstruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for IncreasePositionPreSwap instruction');
    }
    if (
        !INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('IncreasePositionPreSwap instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            keeperAta: instruction.keys[1]!,
            positionRequest: instruction.keys[2]!,
            positionRequestAta: instruction.keys[3]!,
            position: instruction.keys[4]!,
            collateralCustody: instruction.keys[5]!,
            collateralCustodyTokenAccount: instruction.keys[6]!,
            instructionSysvar: instruction.keys[7]!,
            tokenProgram: instruction.keys[8]!,
            eventAuthority: instruction.keys[9]!,
            program: instruction.keys[10]!,
        },
        data: {},
    };
}

export function createIncreasePositionPreSwapInstruction(
    accounts: IncreasePositionPreSwapInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.keeperAta, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.instructionSysvar, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INCREASE_POSITION_PRE_SWAP_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
