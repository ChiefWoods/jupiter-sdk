import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const DECREASE_POSITION4_INSTRUCTION_DISCRIMINATOR = new Uint8Array([185, 161, 114, 175, 96, 148, 3, 170]);

export interface DecreasePosition4InstructionAccounts {
    keeper: Address;
    owner: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    positionRequest: Address;
    positionRequestAta: Address;
    position: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyPythnetPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedDecreasePosition4Instruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        owner: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        positionRequest: AccountMeta;
        positionRequestAta: AccountMeta;
        position: AccountMeta;
        custody: AccountMeta;
        custodyDovesPriceAccount: AccountMeta;
        custodyPythnetPriceAccount: AccountMeta;
        collateralCustody: AccountMeta;
        collateralCustodyDovesPriceAccount: AccountMeta;
        collateralCustodyPythnetPriceAccount: AccountMeta;
        collateralCustodyTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseDecreasePosition4Instruction(
    instruction: TransactionInstruction,
): ParsedDecreasePosition4Instruction {
    if (instruction.keys.length < 18) {
        throw new Error('Expected 18 account metas for DecreasePosition4 instruction');
    }
    if (!DECREASE_POSITION4_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('DecreasePosition4 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            owner: instruction.keys[1]!,
            transferAuthority: instruction.keys[2]!,
            perpetuals: instruction.keys[3]!,
            pool: instruction.keys[4]!,
            positionRequest: instruction.keys[5]!,
            positionRequestAta: instruction.keys[6]!,
            position: instruction.keys[7]!,
            custody: instruction.keys[8]!,
            custodyDovesPriceAccount: instruction.keys[9]!,
            custodyPythnetPriceAccount: instruction.keys[10]!,
            collateralCustody: instruction.keys[11]!,
            collateralCustodyDovesPriceAccount: instruction.keys[12]!,
            collateralCustodyPythnetPriceAccount: instruction.keys[13]!,
            collateralCustodyTokenAccount: instruction.keys[14]!,
            tokenProgram: instruction.keys[15]!,
            eventAuthority: instruction.keys[16]!,
            program: instruction.keys[17]!,
        },
        data: {},
    };
}

export function createDecreasePosition4Instruction(
    accounts: DecreasePosition4InstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(DECREASE_POSITION4_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
