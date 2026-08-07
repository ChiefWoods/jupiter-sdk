import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { STABLECOIN_PROGRAM_ID } from '../programs/stablecoin';
import { findCustodianTokenAccountPda } from '../pdas/custodianTokenAccount';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const MINT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([51, 57, 225, 47, 182, 146, 137, 166]);

export interface MintInstructionAccounts {
    user: Address;
    userCollateralTokenAccount: Address;
    userLpTokenAccount: Address;
    config: Address;
    authority: Address;
    lpMint: Address;
    vault: Address;
    vaultMint: Address;
    custodian: Address;
    custodianTokenAccount?: Address;
    benefactor: Address;
    lpTokenProgram: Address;
    vaultTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface MintInstructionArgs {
    amount: number | bigint;
    minAmountOut: number | bigint;
}

function getMintInstructionDataEncoder(): Encoder<MintInstructionArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

function getMintInstructionDataDecoder(): Decoder<MintInstructionArgs> {
    return getStructDecoder([
        ['amount', getU64Decoder()],
        ['minAmountOut', getU64Decoder()],
    ]);
}

export interface ParsedMintInstruction {
    programId: Address;
    accounts: {
        user: AccountMeta;
        userCollateralTokenAccount: AccountMeta;
        userLpTokenAccount: AccountMeta;
        config: AccountMeta;
        authority: AccountMeta;
        lpMint: AccountMeta;
        vault: AccountMeta;
        vaultMint: AccountMeta;
        custodian: AccountMeta;
        custodianTokenAccount: AccountMeta;
        benefactor: AccountMeta;
        lpTokenProgram: AccountMeta;
        vaultTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: MintInstructionArgs;
}

export function parseMintInstruction(instruction: TransactionInstruction): ParsedMintInstruction {
    if (instruction.keys.length < 16) {
        throw new Error('Expected 16 account metas for Mint instruction');
    }
    if (!MINT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Mint instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            user: instruction.keys[0]!,
            userCollateralTokenAccount: instruction.keys[1]!,
            userLpTokenAccount: instruction.keys[2]!,
            config: instruction.keys[3]!,
            authority: instruction.keys[4]!,
            lpMint: instruction.keys[5]!,
            vault: instruction.keys[6]!,
            vaultMint: instruction.keys[7]!,
            custodian: instruction.keys[8]!,
            custodianTokenAccount: instruction.keys[9]!,
            benefactor: instruction.keys[10]!,
            lpTokenProgram: instruction.keys[11]!,
            vaultTokenProgram: instruction.keys[12]!,
            systemProgram: instruction.keys[13]!,
            eventAuthority: instruction.keys[14]!,
            program: instruction.keys[15]!,
        },
        data: getMintInstructionDataDecoder().decode(instructionData),
    };
}

export async function createMintInstruction(
    accounts: MintInstructionAccounts,
    args: MintInstructionArgs,
    programId: Address = STABLECOIN_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let custodianTokenAccount = accounts.custodianTokenAccount;
    if (!custodianTokenAccount) {
        const [derived] = await findCustodianTokenAccountPda({
            custodian: accounts.custodian,
            vaultTokenProgram: accounts.vaultTokenProgram,
            vaultMint: accounts.vaultMint,
        });
        custodianTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.userCollateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userLpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: accounts.lpMint, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
        { pubkey: accounts.custodian, isSigner: false, isWritable: false },
        { pubkey: custodianTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getMintInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(MINT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
