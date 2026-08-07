import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const WITHDRAW_STAKE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([153, 8, 22, 138, 105, 176, 87, 66]);

export interface WithdrawStakeInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyTokenAccount: Address;
    transferAuthority: Address;
    stakeAccount: Address;
    stakeInfo: Address;
    clock: Address;
    stakeHistory: Address;
    stakeProgram: Address;
    systemProgram: Address;
    tokenProgram: Address;
}

export interface ParsedWithdrawStakeInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        custodyTokenAccount: AccountMeta;
        transferAuthority: AccountMeta;
        stakeAccount: AccountMeta;
        stakeInfo: AccountMeta;
        clock: AccountMeta;
        stakeHistory: AccountMeta;
        stakeProgram: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseWithdrawStakeInstruction(instruction: TransactionInstruction): ParsedWithdrawStakeInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for WithdrawStake instruction');
    }
    if (!WITHDRAW_STAKE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('WithdrawStake instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            custodyTokenAccount: instruction.keys[4]!,
            transferAuthority: instruction.keys[5]!,
            stakeAccount: instruction.keys[6]!,
            stakeInfo: instruction.keys[7]!,
            clock: instruction.keys[8]!,
            stakeHistory: instruction.keys[9]!,
            stakeProgram: instruction.keys[10]!,
            systemProgram: instruction.keys[11]!,
            tokenProgram: instruction.keys[12]!,
        },
        data: {},
    };
}

export function createWithdrawStakeInstruction(
    accounts: WithdrawStakeInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: true },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
        { pubkey: accounts.clock, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeHistory, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(WITHDRAW_STAKE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
