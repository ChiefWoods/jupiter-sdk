import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findEscrowPda } from '../pdas/escrow';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import {
    getCreateVestingEscrowParametersDecoder,
    getCreateVestingEscrowParametersEncoder,
    type CreateVestingEscrowParametersArgs,
} from '../types/createVestingEscrowParameters';
import {
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import {
    getRemainingAccountsInfoDecoder,
    getRemainingAccountsInfoEncoder,
    type RemainingAccountsInfoArgs,
} from '../types/remainingAccountsInfo';

export const CREATE_VESTING_ESCROW_V2_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    181, 155, 104, 183, 182, 128, 35, 47,
]);

export interface CreateVestingEscrowV2InstructionAccounts {
    base: Address;
    escrow?: Address;
    tokenMint: Address;
    escrowToken?: Address;
    sender: Address;
    senderToken: Address;
    recipient: Address;
    tokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateVestingEscrowV2InstructionArgs {
    params: CreateVestingEscrowParametersArgs;
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getCreateVestingEscrowV2InstructionDataEncoder(): Encoder<CreateVestingEscrowV2InstructionArgs> {
    return getStructEncoder([
        ['params', getCreateVestingEscrowParametersEncoder()],
        ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
    ]);
}

function getCreateVestingEscrowV2InstructionDataDecoder(): Decoder<CreateVestingEscrowV2InstructionArgs> {
    return getStructDecoder([
        ['params', getCreateVestingEscrowParametersDecoder()],
        ['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())],
    ]);
}

export interface ParsedCreateVestingEscrowV2Instruction {
    programId: Address;
    accounts: {
        base: AccountMeta;
        escrow: AccountMeta;
        tokenMint: AccountMeta;
        escrowToken: AccountMeta;
        sender: AccountMeta;
        senderToken: AccountMeta;
        recipient: AccountMeta;
        tokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateVestingEscrowV2InstructionArgs;
}

export function parseCreateVestingEscrowV2Instruction(
    instruction: TransactionInstruction,
): ParsedCreateVestingEscrowV2Instruction {
    if (instruction.keys.length < 11) {
        throw new Error('Expected 11 account metas for CreateVestingEscrowV2 instruction');
    }
    if (
        !CREATE_VESTING_ESCROW_V2_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('CreateVestingEscrowV2 instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            base: instruction.keys[0]!,
            escrow: instruction.keys[1]!,
            tokenMint: instruction.keys[2]!,
            escrowToken: instruction.keys[3]!,
            sender: instruction.keys[4]!,
            senderToken: instruction.keys[5]!,
            recipient: instruction.keys[6]!,
            tokenProgram: instruction.keys[7]!,
            systemProgram: instruction.keys[8]!,
            eventAuthority: instruction.keys[9]!,
            program: instruction.keys[10]!,
        },
        data: getCreateVestingEscrowV2InstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateVestingEscrowV2Instruction(
    accounts: CreateVestingEscrowV2InstructionAccounts,
    args: CreateVestingEscrowV2InstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrow = accounts.escrow;
    if (!escrow) {
        const [derived] = await findEscrowPda(
            {
                base: accounts.base,
            },
            programId,
        );
        escrow = derived;
    }
    let escrowToken = accounts.escrowToken;
    if (!escrowToken) {
        const [derived] = await findEscrowTokenPda({
            escrow: accounts.escrow,
            tokenProgram: accounts.tokenProgram,
            tokenMint: accounts.tokenMint,
        });
        escrowToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: true },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: escrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.senderToken, isSigner: false, isWritable: true },
        { pubkey: accounts.recipient, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateVestingEscrowV2InstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_VESTING_ESCROW_V2_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
