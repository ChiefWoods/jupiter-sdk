import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { findCustodianTokenAccountPda } from '../pdas/custodianTokenAccount';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const WITHDRAW_INSTRUCTION_DISCRIMINATOR = new Uint8Array([183, 18, 70, 156, 148, 109, 161, 34]);

export interface WithdrawInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    custodian: Address;
    custodianTokenAccount?: Address;
    config: Address;
    authority: Address;
    vault: Address;
    vaultTokenAccount: Address;
    vaultMint: Address;
    tokenProgram: Address;
}

export interface WithdrawInstructionArgs {
    amount: number | bigint;
}

function getWithdrawInstructionDataEncoder(): Encoder<WithdrawInstructionArgs> {
    return getStructEncoder([['amount', getU64Encoder()]]);
}

function getWithdrawInstructionDataDecoder(): Decoder<WithdrawInstructionArgs> {
    return getStructDecoder([['amount', getU64Decoder()]]);
}

export interface ParsedWithdrawInstruction {
    programId: Address;
    accounts: {
        operatorAuthority: AccountMeta;
        operator: AccountMeta;
        custodian: AccountMeta;
        custodianTokenAccount: AccountMeta;
        config: AccountMeta;
        authority: AccountMeta;
        vault: AccountMeta;
        vaultTokenAccount: AccountMeta;
        vaultMint: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: WithdrawInstructionArgs;
}

export function parseWithdrawInstruction(instruction: TransactionInstruction): ParsedWithdrawInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for Withdraw instruction');
    }
    if (!WITHDRAW_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Withdraw instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            operatorAuthority: instruction.keys[0]!,
            operator: instruction.keys[1]!,
            custodian: instruction.keys[2]!,
            custodianTokenAccount: instruction.keys[3]!,
            config: instruction.keys[4]!,
            authority: instruction.keys[5]!,
            vault: instruction.keys[6]!,
            vaultTokenAccount: instruction.keys[7]!,
            vaultMint: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
        },
        data: getWithdrawInstructionDataDecoder().decode(instructionData),
    };
}

export async function createWithdrawInstruction(
    accounts: WithdrawInstructionAccounts,
    args: WithdrawInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let custodianTokenAccount = accounts.custodianTokenAccount;
    if (!custodianTokenAccount) {
        const [derived] = await findCustodianTokenAccountPda({
            custodian: accounts.custodian,
            vaultTokenProgram: accounts.tokenProgram,
            vaultMint: accounts.vaultMint,
        });
        custodianTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.custodian, isSigner: false, isWritable: false },
        { pubkey: custodianTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getWithdrawInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(WITHDRAW_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
