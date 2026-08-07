import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { GOVERNANCE_PROGRAM_ID } from '../programs/governance';

export const CLAIM_REWARD_INSTRUCTION_DISCRIMINATOR = new Uint8Array([149, 95, 181, 242, 94, 90, 158, 162]);

export interface ClaimRewardInstructionAccounts {
    governor: Address;
    rewardVault: Address;
    proposal: Address;
    vote: Address;
    voter: Address;
    voterTokenAccount: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface ParsedClaimRewardInstruction {
    programId: Address;
    accounts: {
        governor: AccountMeta;
        rewardVault: AccountMeta;
        proposal: AccountMeta;
        vote: AccountMeta;
        voter: AccountMeta;
        voterTokenAccount: AccountMeta;
        tokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseClaimRewardInstruction(instruction: TransactionInstruction): ParsedClaimRewardInstruction {
    if (instruction.keys.length < 9) {
        throw new Error('Expected 9 account metas for ClaimReward instruction');
    }
    if (!CLAIM_REWARD_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimReward instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            governor: instruction.keys[0]!,
            rewardVault: instruction.keys[1]!,
            proposal: instruction.keys[2]!,
            vote: instruction.keys[3]!,
            voter: instruction.keys[4]!,
            voterTokenAccount: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
            eventAuthority: instruction.keys[7]!,
            program: instruction.keys[8]!,
        },
        data: {},
    };
}

export function createClaimRewardInstruction(
    accounts: ClaimRewardInstructionAccounts,
    programId: Address = GOVERNANCE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.governor, isSigner: false, isWritable: true },
        { pubkey: accounts.rewardVault, isSigner: false, isWritable: true },
        { pubkey: accounts.proposal, isSigner: false, isWritable: true },
        { pubkey: accounts.vote, isSigner: false, isWritable: true },
        { pubkey: accounts.voter, isSigner: true, isWritable: false },
        { pubkey: accounts.voterTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_REWARD_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
