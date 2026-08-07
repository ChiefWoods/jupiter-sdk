import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const LIQUIDATE_FULL_POSITION4_INSTRUCTION_DISCRIMINATOR = new Uint8Array([64, 176, 88, 51, 168, 188, 156, 175]);

export interface LiquidateFullPosition4InstructionAccounts {
    signer: Address;
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
    eventAuthority: Address;
    program: Address;
}

export interface ParsedLiquidateFullPosition4Instruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
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
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseLiquidateFullPosition4Instruction(
    instruction: TransactionInstruction,
): ParsedLiquidateFullPosition4Instruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for LiquidateFullPosition4 instruction');
    }
    if (
        !LIQUIDATE_FULL_POSITION4_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('LiquidateFullPosition4 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            position: instruction.keys[3]!,
            custody: instruction.keys[4]!,
            custodyDovesPriceAccount: instruction.keys[5]!,
            custodyPythnetPriceAccount: instruction.keys[6]!,
            collateralCustody: instruction.keys[7]!,
            collateralCustodyDovesPriceAccount: instruction.keys[8]!,
            collateralCustodyPythnetPriceAccount: instruction.keys[9]!,
            collateralCustodyTokenAccount: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: {},
    };
}

export function createLiquidateFullPosition4Instruction(
    accounts: LiquidateFullPosition4InstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
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
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(LIQUIDATE_FULL_POSITION4_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
