import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCK_PROGRAM_ID } from '../programs/lock';
import { findBasePda } from '../pdas/base';
import { findEscrowPda } from '../pdas/escrow';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRootEscrowTokenPda } from '../pdas/rootEscrowToken';
import {
    fixDecoderSize,
    fixEncoderSize,
    getArrayDecoder,
    getArrayEncoder,
    getBytesDecoder,
    getBytesEncoder,
    getOptionDecoder,
    getOptionEncoder,
    getStructDecoder,
    getStructEncoder,
    getU64Decoder,
    getU64Encoder,
    getU8Decoder,
    getU8Encoder,
    type Decoder,
    type Encoder,
    type OptionOrNullable,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import {
    getRemainingAccountsInfoDecoder,
    getRemainingAccountsInfoEncoder,
    type RemainingAccountsInfoArgs,
} from '../types/remainingAccountsInfo';

export const CREATE_VESTING_ESCROW_FROM_ROOT_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    6, 238, 161, 108, 252, 114, 246, 91,
]);

export interface CreateVestingEscrowFromRootInstructionAccounts {
    rootEscrow: Address;
    base?: Address;
    escrow?: Address;
    escrowToken?: Address;
    rootEscrowToken?: Address;
    tokenMint: Address;
    payer: Address;
    recipient: Address;
    systemProgram: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateVestingEscrowFromRootInstructionArgs {
    vestingStartTime: number | bigint;
    cliffTime: number | bigint;
    frequency: number | bigint;
    cliffUnlockAmount: number | bigint;
    amountPerPeriod: number | bigint;
    numberOfPeriod: number | bigint;
    updateRecipientMode: number;
    cancelMode: number;
    proof: Array<ReadonlyUint8Array>;
    remainingAccountsInfo: OptionOrNullable<RemainingAccountsInfoArgs>;
}

function getCreateVestingEscrowFromRootInstructionDataEncoder(): Encoder<CreateVestingEscrowFromRootInstructionArgs> {
    return getStructEncoder([
        ['vestingStartTime', getU64Encoder()],
        ['cliffTime', getU64Encoder()],
        ['frequency', getU64Encoder()],
        ['cliffUnlockAmount', getU64Encoder()],
        ['amountPerPeriod', getU64Encoder()],
        ['numberOfPeriod', getU64Encoder()],
        ['updateRecipientMode', getU8Encoder()],
        ['cancelMode', getU8Encoder()],
        ['proof', getArrayEncoder(fixEncoderSize(getBytesEncoder(), 32))],
        ['remainingAccountsInfo', getOptionEncoder(getRemainingAccountsInfoEncoder())],
    ]);
}

function getCreateVestingEscrowFromRootInstructionDataDecoder(): Decoder<CreateVestingEscrowFromRootInstructionArgs> {
    return getStructDecoder([
        ['vestingStartTime', getU64Decoder()],
        ['cliffTime', getU64Decoder()],
        ['frequency', getU64Decoder()],
        ['cliffUnlockAmount', getU64Decoder()],
        ['amountPerPeriod', getU64Decoder()],
        ['numberOfPeriod', getU64Decoder()],
        ['updateRecipientMode', getU8Decoder()],
        ['cancelMode', getU8Decoder()],
        ['proof', getArrayDecoder(fixDecoderSize(getBytesDecoder(), 32))],
        ['remainingAccountsInfo', getOptionDecoder(getRemainingAccountsInfoDecoder())],
    ]);
}

export interface ParsedCreateVestingEscrowFromRootInstruction {
    programId: Address;
    accounts: {
        rootEscrow: AccountMeta;
        base: AccountMeta;
        escrow: AccountMeta;
        escrowToken: AccountMeta;
        rootEscrowToken: AccountMeta;
        tokenMint: AccountMeta;
        payer: AccountMeta;
        recipient: AccountMeta;
        systemProgram: AccountMeta;
        tokenProgram: AccountMeta;
        associatedTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: CreateVestingEscrowFromRootInstructionArgs;
}

export function parseCreateVestingEscrowFromRootInstruction(
    instruction: TransactionInstruction,
): ParsedCreateVestingEscrowFromRootInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for CreateVestingEscrowFromRoot instruction');
    }
    if (
        !CREATE_VESTING_ESCROW_FROM_ROOT_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('CreateVestingEscrowFromRoot instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            rootEscrow: instruction.keys[0]!,
            base: instruction.keys[1]!,
            escrow: instruction.keys[2]!,
            escrowToken: instruction.keys[3]!,
            rootEscrowToken: instruction.keys[4]!,
            tokenMint: instruction.keys[5]!,
            payer: instruction.keys[6]!,
            recipient: instruction.keys[7]!,
            systemProgram: instruction.keys[8]!,
            tokenProgram: instruction.keys[9]!,
            associatedTokenProgram: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: getCreateVestingEscrowFromRootInstructionDataDecoder().decode(instructionData),
    };
}

export async function createCreateVestingEscrowFromRootInstruction(
    accounts: CreateVestingEscrowFromRootInstructionAccounts,
    args: CreateVestingEscrowFromRootInstructionArgs,
    programId: Address = LOCK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let base = accounts.base;
    if (!base) {
        const [derived] = await findBasePda(
            {
                rootEscrow: accounts.rootEscrow,
                recipient: accounts.recipient,
            },
            programId,
        );
        base = derived;
    }
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
    let rootEscrowToken = accounts.rootEscrowToken;
    if (!rootEscrowToken) {
        const [derived] = await findRootEscrowTokenPda({
            rootEscrow: accounts.rootEscrow,
            tokenProgram: accounts.tokenProgram,
            tokenMint: accounts.tokenMint,
        });
        rootEscrowToken = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.rootEscrow, isSigner: false, isWritable: true },
        { pubkey: base, isSigner: false, isWritable: false },
        { pubkey: escrow, isSigner: false, isWritable: true },
        { pubkey: escrowToken, isSigner: false, isWritable: true },
        { pubkey: rootEscrowToken, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.recipient, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.from(getCreateVestingEscrowFromRootInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CREATE_VESTING_ESCROW_FROM_ROOT_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
