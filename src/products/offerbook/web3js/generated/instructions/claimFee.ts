import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';

export const CLAIM_FEE_INSTRUCTION_DISCRIMINATOR = new Uint8Array([169, 32, 79, 137, 136, 232, 70, 137]);

export interface ClaimFeeInstructionAccounts {
    admin: Address;
    config: Address;
    feeAuthority: Address;
    mint: Address;
    protocolFeeTokenAccount: Address;
    destTokenAccount: Address;
    tokenProgram: Address;
}

export interface ParsedClaimFeeInstruction {
    programId: Address;
    accounts: {
        admin: AccountMeta;
        config: AccountMeta;
        feeAuthority: AccountMeta;
        mint: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        destTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: {};
}

export function parseClaimFeeInstruction(instruction: TransactionInstruction): ParsedClaimFeeInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for ClaimFee instruction');
    }
    if (!CLAIM_FEE_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimFee instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            admin: instruction.keys[0]!,
            config: instruction.keys[1]!,
            feeAuthority: instruction.keys[2]!,
            mint: instruction.keys[3]!,
            protocolFeeTokenAccount: instruction.keys[4]!,
            destTokenAccount: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
        },
        data: {},
    };
}

export function createClaimFeeInstruction(
    accounts: ClaimFeeInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.feeAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.destTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_FEE_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
