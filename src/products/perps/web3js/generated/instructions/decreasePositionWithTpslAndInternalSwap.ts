import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const DECREASE_POSITION_WITH_TPSL_AND_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    2, 111, 200, 231, 35, 65, 123, 235,
]);

export interface DecreasePositionWithTpslAndInternalSwapInstructionAccounts {
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
    collateralCustody: Address;
    collateralCustodyDovesPriceAccount: Address;
    collateralCustodyTokenAccount: Address;
    dispensingCustody: Address;
    dispensingCustodyDovesPriceAccount: Address;
    dispensingCustodyTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedDecreasePositionWithTpslAndInternalSwapInstruction {
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
        collateralCustody: AccountMeta;
        collateralCustodyDovesPriceAccount: AccountMeta;
        collateralCustodyTokenAccount: AccountMeta;
        dispensingCustody: AccountMeta;
        dispensingCustodyDovesPriceAccount: AccountMeta;
        dispensingCustodyTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseDecreasePositionWithTpslAndInternalSwapInstruction(
    instruction: TransactionInstruction,
): ParsedDecreasePositionWithTpslAndInternalSwapInstruction {
    if (instruction.keys.length < 19) {
        throw new Error('Expected 19 account metas for DecreasePositionWithTpslAndInternalSwap instruction');
    }
    if (
        !DECREASE_POSITION_WITH_TPSL_AND_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('DecreasePositionWithTpslAndInternalSwap instruction discriminator mismatch');
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
            collateralCustody: instruction.keys[10]!,
            collateralCustodyDovesPriceAccount: instruction.keys[11]!,
            collateralCustodyTokenAccount: instruction.keys[12]!,
            dispensingCustody: instruction.keys[13]!,
            dispensingCustodyDovesPriceAccount: instruction.keys[14]!,
            dispensingCustodyTokenAccount: instruction.keys[15]!,
            tokenProgram: instruction.keys[16]!,
            eventAuthority: instruction.keys[17]!,
            program: instruction.keys[18]!,
        },
        data: {},
    };
}

export function createDecreasePositionWithTpslAndInternalSwapInstruction(
    accounts: DecreasePositionWithTpslAndInternalSwapInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.owner, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequest, isSigner: false, isWritable: true },
        { pubkey: accounts.positionRequestAta, isSigner: false, isWritable: true },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustody, isSigner: false, isWritable: true },
        { pubkey: accounts.dispensingCustodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.dispensingCustodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(DECREASE_POSITION_WITH_TPSL_AND_INTERNAL_SWAP_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
