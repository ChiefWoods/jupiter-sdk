import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const REFRESH_ASSETS_UNDER_MANAGEMENT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    162, 0, 215, 55, 225, 15, 185, 0,
]);

export interface RefreshAssetsUnderManagementInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    lpTokenMint: Address;
}

export interface ParsedRefreshAssetsUnderManagementInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        lpTokenMint: AccountMeta;
    };
    data: {};
}

export function parseRefreshAssetsUnderManagementInstruction(
    instruction: TransactionInstruction,
): ParsedRefreshAssetsUnderManagementInstruction {
    if (instruction.keys.length < 4) {
        throw new Error('Expected 4 account metas for RefreshAssetsUnderManagement instruction');
    }
    if (
        !REFRESH_ASSETS_UNDER_MANAGEMENT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('RefreshAssetsUnderManagement instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            lpTokenMint: instruction.keys[3]!,
        },
        data: {},
    };
}

export function createRefreshAssetsUnderManagementInstruction(
    accounts: RefreshAssetsUnderManagementInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REFRESH_ASSETS_UNDER_MANAGEMENT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
