import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const REDEEM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([184, 12, 86, 149, 70, 196, 97, 225]);

export interface RedeemInstructionAccounts {
    user: Address;
    userLpTokenAccount: Address;
    userCollateralTokenAccount: Address;
    config: Address;
    authority: Address;
    lpMint: Address;
    vault: Address;
    vaultTokenAccount: Address;
    vaultMint: Address;
    benefactor: Address;
    lpTokenProgram: Address;
    vaultTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface RedeemInstructionArgs {
    amount: number | bigint;
    minAmountOut: number | bigint;
}

function getRedeemInstructionDataEncoder(): Encoder<RedeemInstructionArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

function getRedeemInstructionDataDecoder(): Decoder<RedeemInstructionArgs> {
    return getStructDecoder([
        ['amount', getU64Decoder()],
        ['minAmountOut', getU64Decoder()],
    ]);
}

export interface ParsedRedeemInstruction {
    programId: Address;
    accounts: {
        user: AccountMeta;
        userLpTokenAccount: AccountMeta;
        userCollateralTokenAccount: AccountMeta;
        config: AccountMeta;
        authority: AccountMeta;
        lpMint: AccountMeta;
        vault: AccountMeta;
        vaultTokenAccount: AccountMeta;
        vaultMint: AccountMeta;
        benefactor: AccountMeta;
        lpTokenProgram: AccountMeta;
        vaultTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: RedeemInstructionArgs;
}

export function parseRedeemInstruction(instruction: TransactionInstruction): ParsedRedeemInstruction {
    if (instruction.keys.length < 15) {
        throw new Error('Expected 15 account metas for Redeem instruction');
    }
    if (!REDEEM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Redeem instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            user: instruction.keys[0]!,
            userLpTokenAccount: instruction.keys[1]!,
            userCollateralTokenAccount: instruction.keys[2]!,
            config: instruction.keys[3]!,
            authority: instruction.keys[4]!,
            lpMint: instruction.keys[5]!,
            vault: instruction.keys[6]!,
            vaultTokenAccount: instruction.keys[7]!,
            vaultMint: instruction.keys[8]!,
            benefactor: instruction.keys[9]!,
            lpTokenProgram: instruction.keys[10]!,
            vaultTokenProgram: instruction.keys[11]!,
            systemProgram: instruction.keys[12]!,
            eventAuthority: instruction.keys[13]!,
            program: instruction.keys[14]!,
        },
        data: getRedeemInstructionDataDecoder().decode(instructionData),
    };
}

export async function createRedeemInstruction(
    accounts: RedeemInstructionAccounts,
    args: RedeemInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.userLpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userCollateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: accounts.lpMint, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getRedeemInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REDEEM_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
