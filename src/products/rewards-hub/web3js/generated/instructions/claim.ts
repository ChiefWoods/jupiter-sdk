import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { REWARDSHUB_PROGRAM_ID } from '../programs/rewardsHub';
import { findClaimStatusPda } from '../pdas/claimStatus';
import {
    getArrayDecoder,
    getArrayEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CLAIM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([62, 198, 214, 193, 213, 159, 108, 210]);

export interface ClaimInstructionAccounts {
    campaign: Address;
    claimStatus?: Address;
    from: Address;
    to: Address;
    claimant: Address;
    claimsPubkey: Address;
    tokenProgram: Address;
}

export interface ClaimInstructionArgs {
    amountUnlocked: Array<number | bigint>;
    lootboxInfo: Array<number | bigint>;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([
        ['amountUnlocked', getArrayEncoder(getU64Encoder(), { size: 5 })],
        ['lootboxInfo', getArrayEncoder(getU64Encoder(), { size: 5 })],
    ]);
}

function getClaimInstructionDataDecoder(): Decoder<ClaimInstructionArgs> {
    return getStructDecoder([
        ['amountUnlocked', getArrayDecoder(getU64Decoder(), { size: 5 })],
        ['lootboxInfo', getArrayDecoder(getU64Decoder(), { size: 5 })],
    ]);
}

export interface ParsedClaimInstruction {
    programId: Address;
    accounts: {
        campaign: AccountMeta;
        claimStatus: AccountMeta;
        from: AccountMeta;
        to: AccountMeta;
        claimant: AccountMeta;
        claimsPubkey: AccountMeta;
        tokenProgram: AccountMeta;
    };
    data: ClaimInstructionArgs;
}

export function parseClaimInstruction(instruction: TransactionInstruction): ParsedClaimInstruction {
    if (instruction.keys.length < 7) {
        throw new Error('Expected 7 account metas for Claim instruction');
    }
    if (!CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Claim instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            campaign: instruction.keys[0]!,
            claimStatus: instruction.keys[1]!,
            from: instruction.keys[2]!,
            to: instruction.keys[3]!,
            claimant: instruction.keys[4]!,
            claimsPubkey: instruction.keys[5]!,
            tokenProgram: instruction.keys[6]!,
        },
        data: getClaimInstructionDataDecoder().decode(instructionData),
    };
}

export async function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = REWARDSHUB_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let claimStatus = accounts.claimStatus;
    if (!claimStatus) {
        const [derived] = await findClaimStatusPda(
            {
                claimant: accounts.claimant,
                campaign: accounts.campaign,
            },
            programId,
        );
        claimStatus = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.campaign, isSigner: false, isWritable: true },
        { pubkey: claimStatus, isSigner: false, isWritable: true },
        { pubkey: accounts.from, isSigner: false, isWritable: true },
        { pubkey: accounts.to, isSigner: false, isWritable: true },
        { pubkey: accounts.claimant, isSigner: true, isWritable: true },
        { pubkey: accounts.claimsPubkey, isSigner: true, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getClaimInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
