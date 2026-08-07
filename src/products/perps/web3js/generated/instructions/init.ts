import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';
import {
    getBooleanDecoder,
    getBooleanEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([220, 59, 207, 236, 108, 250, 47, 100]);

export interface InitInstructionAccounts {
    upgradeAuthority: Address;
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    perpetualsProgram: Address;
    perpetualsProgramData: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface InitInstructionArgs {
    allowSwap: boolean;
    allowAddLiquidity: boolean;
    allowRemoveLiquidity: boolean;
    allowIncreasePosition: boolean;
    allowDecreasePosition: boolean;
    allowCollateralWithdrawal: boolean;
    allowLiquidatePosition: boolean;
}

function getInitInstructionDataEncoder(): Encoder<InitInstructionArgs> {
    return getStructEncoder([
        ['allowSwap', getBooleanEncoder()],
        ['allowAddLiquidity', getBooleanEncoder()],
        ['allowRemoveLiquidity', getBooleanEncoder()],
        ['allowIncreasePosition', getBooleanEncoder()],
        ['allowDecreasePosition', getBooleanEncoder()],
        ['allowCollateralWithdrawal', getBooleanEncoder()],
        ['allowLiquidatePosition', getBooleanEncoder()],
    ]);
}

function getInitInstructionDataDecoder(): Decoder<InitInstructionArgs> {
    return getStructDecoder([
        ['allowSwap', getBooleanDecoder()],
        ['allowAddLiquidity', getBooleanDecoder()],
        ['allowRemoveLiquidity', getBooleanDecoder()],
        ['allowIncreasePosition', getBooleanDecoder()],
        ['allowDecreasePosition', getBooleanDecoder()],
        ['allowCollateralWithdrawal', getBooleanDecoder()],
        ['allowLiquidatePosition', getBooleanDecoder()],
    ]);
}

export interface ParsedInitInstruction {
    programId: Address;
    accounts: {
        upgradeAuthority: AccountMeta;
        admin: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        perpetualsProgram: AccountMeta;
        perpetualsProgramData: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: InitInstructionArgs;
}

export function parseInitInstruction(instruction: TransactionInstruction): ParsedInitInstruction {
    if (instruction.keys.length < 8) {
        throw new Error('Expected 8 account metas for Init instruction');
    }
    if (!INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Init instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            upgradeAuthority: instruction.keys[0]!,
            admin: instruction.keys[1]!,
            transferAuthority: instruction.keys[2]!,
            perpetuals: instruction.keys[3]!,
            perpetualsProgram: instruction.keys[4]!,
            perpetualsProgramData: instruction.keys[5]!,
            systemProgram: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
        },
        data: getInitInstructionDataDecoder().decode(instructionData),
    };
}

export function createInitInstruction(
    accounts: InitInstructionAccounts,
    args: InitInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.admin, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetualsProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetualsProgramData, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
