import { AGGREGATORV6_PROGRAM_ID } from '../programs/aggregatorV6';
import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import {
    getStructDecoder,
    getStructEncoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const CLAIM_INSTRUCTION_DISCRIMINATOR = new Uint8Array([62, 198, 214, 193, 213, 159, 108, 210]);

export interface ClaimInstructionAccounts {
    wallet: Address;
    programAuthority: Address;
    systemProgram: Address;
}

export interface ClaimInstructionArgs {
    id: number;
}

function getClaimInstructionDataEncoder(): Encoder<ClaimInstructionArgs> {
    return getStructEncoder([['id', getU8Encoder()]]);
}

function getClaimInstructionDataDecoder(): Decoder<ClaimInstructionArgs> {
    return getStructDecoder([['id', getU8Decoder()]]);
}

export interface ParsedClaimInstruction {
    programId: Address;
    accounts: {
        wallet: AccountMeta;
        programAuthority: AccountMeta;
        systemProgram: AccountMeta;
    };
    data: ClaimInstructionArgs;
}

export function parseClaimInstruction(instruction: TransactionInstruction): ParsedClaimInstruction {
    if (instruction.keys.length < 3) {
        throw new Error('Expected 3 account metas for Claim instruction');
    }
    if (!CLAIM_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('Claim instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            wallet: instruction.keys[0]!,
            programAuthority: instruction.keys[1]!,
            systemProgram: instruction.keys[2]!,
        },
        data: getClaimInstructionDataDecoder().decode(instructionData),
    };
}

export function createClaimInstruction(
    accounts: ClaimInstructionAccounts,
    args: ClaimInstructionArgs,
    programId: Address = AGGREGATORV6_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.wallet, isSigner: false, isWritable: true },
        { pubkey: accounts.programAuthority, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
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
