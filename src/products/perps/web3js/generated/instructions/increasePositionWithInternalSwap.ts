import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const INCREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    114, 55, 106, 140, 199, 221, 32, 112,
]);

export interface IncreasePositionWithInternalSwapInstructionAccounts {
    keeper: Address;
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
    receivingCustody: Address;
    receivingCustodyDovesPriceAccount: Address;
    receivingCustodyPythnetPriceAccount: Address;
    receivingCustodyTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedIncreasePositionWithInternalSwapInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
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
        receivingCustody: AccountMeta;
        receivingCustodyDovesPriceAccount: AccountMeta;
        receivingCustodyPythnetPriceAccount: AccountMeta;
        receivingCustodyTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseIncreasePositionWithInternalSwapInstruction(
    instruction: TransactionInstruction,
): ParsedIncreasePositionWithInternalSwapInstruction {
    if (instruction.keys.length < 20) {
        throw new Error('Expected 20 account metas for IncreasePositionWithInternalSwap instruction');
    }
    if (
        !INCREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('IncreasePositionWithInternalSwap instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            positionRequest: instruction.keys[3]!,
            positionRequestAta: instruction.keys[4]!,
            position: instruction.keys[5]!,
            custody: instruction.keys[6]!,
            custodyDovesPriceAccount: instruction.keys[7]!,
            custodyPythnetPriceAccount: instruction.keys[8]!,
            collateralCustody: instruction.keys[9]!,
            collateralCustodyDovesPriceAccount: instruction.keys[10]!,
            collateralCustodyPythnetPriceAccount: instruction.keys[11]!,
            collateralCustodyTokenAccount: instruction.keys[12]!,
            receivingCustody: instruction.keys[13]!,
            receivingCustodyDovesPriceAccount: instruction.keys[14]!,
            receivingCustodyPythnetPriceAccount: instruction.keys[15]!,
            receivingCustodyTokenAccount: instruction.keys[16]!,
            tokenProgram: instruction.keys[17]!,
            eventAuthority: instruction.keys[18]!,
            program: instruction.keys[19]!,
        },
        data: {},
    };
}

export function createIncreasePositionWithInternalSwapInstruction(
    accounts: IncreasePositionWithInternalSwapInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
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
        { pubkey: accounts.receivingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.receivingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.receivingCustodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.receivingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INCREASE_POSITION_WITH_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
