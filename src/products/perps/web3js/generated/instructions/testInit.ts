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

export const TEST_INIT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([48, 51, 92, 122, 81, 19, 112, 41]);

export interface TestInitInstructionAccounts {
    upgradeAuthority: Address;
    admin: Address;
    transferAuthority: Address;
    perpetuals: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface TestInitInstructionArgs {
    allowSwap: boolean;
    allowAddLiquidity: boolean;
    allowRemoveLiquidity: boolean;
    allowIncreasePosition: boolean;
    allowDecreasePosition: boolean;
    allowCollateralWithdrawal: boolean;
    allowLiquidatePosition: boolean;
}

function getTestInitInstructionDataEncoder(): Encoder<TestInitInstructionArgs> {
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

function getTestInitInstructionDataDecoder(): Decoder<TestInitInstructionArgs> {
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

export interface ParsedTestInitInstruction {
    programId: Address;
    accounts: {
        upgradeAuthority: AccountMeta;
        admin: AccountMeta;
        transferAuthority: AccountMeta;
        perpetuals: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: TestInitInstructionArgs;
}

export function parseTestInitInstruction(instruction: TransactionInstruction): ParsedTestInitInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for TestInit instruction');
    }
    if (!TEST_INIT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('TestInit instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            upgradeAuthority: instruction.keys[0]!,
            admin: instruction.keys[1]!,
            transferAuthority: instruction.keys[2]!,
            perpetuals: instruction.keys[3]!,
            systemProgram: instruction.keys[4]!,
            tokenProgram: instruction.keys[5]!,
        },
        data: getTestInitInstructionDataDecoder().decode(instructionData),
    };
}

export function createTestInitInstruction(
    accounts: TestInitInstructionAccounts,
    args: TestInitInstructionArgs,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.upgradeAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.admin, isSigner: false, isWritable: false },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getTestInitInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(TEST_INIT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
