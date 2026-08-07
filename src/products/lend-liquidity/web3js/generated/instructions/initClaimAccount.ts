import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDLIQUIDITY_PROGRAM_ID } from '../programs/lendLiquidity';
import { findClaimAccountPda } from '../pdas/claimAccount';
import {
    fixDecoderSize,
    fixEncoderSize,
    getBytesDecoder,
    getBytesEncoder,
    getStructDecoder,
    getStructEncoder,
    transformDecoder,
    transformEncoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const INIT_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([112, 141, 47, 170, 42, 99, 144, 145]);

export interface InitClaimAccountInstructionAccounts {
    signer: Address;
    claimAccount?: Address;
    systemProgram: Address;
}

export interface InitClaimAccountInstructionArgs {
    mint: Address;
    user: Address;
}

function getInitClaimAccountInstructionDataEncoder(): Encoder<InitClaimAccountInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['user', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

function getInitClaimAccountInstructionDataDecoder(): Decoder<InitClaimAccountInstructionArgs> {
    return getStructDecoder([
        ['mint', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
        ['user', transformDecoder(fixDecoderSize(getBytesDecoder(), 32), value => new Address(value))],
    ]);
}

export interface ParsedInitClaimAccountInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        claimAccount: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: InitClaimAccountInstructionArgs;
}

export function parseInitClaimAccountInstruction(
    instruction: TransactionInstruction,
): ParsedInitClaimAccountInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for InitClaimAccount instruction');
    }
    if (!INIT_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('InitClaimAccount instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            claimAccount: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getInitClaimAccountInstructionDataDecoder().decode(instructionData),
    };
}

export async function createInitClaimAccountInstruction(
    accounts: InitClaimAccountInstructionAccounts,
    args: InitClaimAccountInstructionArgs,
    programId: Address = LENDLIQUIDITY_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let claimAccount = accounts.claimAccount;
    if (!claimAccount) {
        const [derived] = await findClaimAccountPda(
            {
                user: args.user,
                mint: args.mint,
            },
            programId,
        );
        claimAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: claimAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getInitClaimAccountInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(INIT_CLAIM_ACCOUNT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
