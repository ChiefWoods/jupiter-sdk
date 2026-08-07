import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPS_PROGRAM_ID } from '../programs/perps';

export const REDEEM_STAKE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([178, 203, 250, 105, 133, 118, 255, 69]);

export interface RedeemStakeInstructionAccounts {
    keeper: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    stakeAccount: Address;
    stakeInfo: Address;
}

export interface ParsedRedeemStakeInstruction {
    programId: Address;
    accounts: {
        keeper: AccountMeta;
        perpetuals: AccountMeta;
        pool: AccountMeta;
        custody: AccountMeta;
        stakeAccount: AccountMeta;
        stakeInfo: AccountMeta;
    };
    data: {};
}

export function parseRedeemStakeInstruction(instruction: TransactionInstruction): ParsedRedeemStakeInstruction {
    if (instruction.keys.length < 6) {
        throw new Error('Expected 6 account metas for RedeemStake instruction');
    }
    if (!REDEEM_STAKE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RedeemStake instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            keeper: instruction.keys[0]!,
            perpetuals: instruction.keys[1]!,
            pool: instruction.keys[2]!,
            custody: instruction.keys[3]!,
            stakeAccount: instruction.keys[4]!,
            stakeInfo: instruction.keys[5]!,
        },
        data: {},
    };
}

export function createRedeemStakeInstruction(
    accounts: RedeemStakeInstructionAccounts,
    programId: Address = PERPS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.stakeAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.stakeInfo, isSigner: false, isWritable: true },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REDEEM_STAKE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
