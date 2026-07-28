import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findBasePda } from '../pdas/base';
import { findEscrowPda } from '../pdas/escrow';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRootEscrowTokenPda } from '../pdas/rootEscrowToken';
import {
    fixEncoderSize,
    getArrayEncoder,
    getBytesEncoder,
    getOptionEncoder,
    getStructEncoder,
    getU64Encoder,
    getU8Encoder,
    type Encoder,
    type OptionOrNullable,
    type ReadonlyUint8Array,
} from '@solana/codecs';
import { getRemainingAccountsInfoEncoder, type RemainingAccountsInfoArgs } from '../types/remainingAccountsInfo';

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

export async function createCreateVestingEscrowFromRootInstruction(
    accounts: CreateVestingEscrowFromRootInstructionAccounts,
    args: CreateVestingEscrowFromRootInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
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
        const [derived] = await findEscrowTokenPda(
            {
                escrow: accounts.escrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
        escrowToken = derived;
    }
    let rootEscrowToken = accounts.rootEscrowToken;
    if (!rootEscrowToken) {
        const [derived] = await findRootEscrowTokenPda(
            {
                rootEscrow: accounts.rootEscrow,
                tokenProgram: accounts.tokenProgram,
                tokenMint: accounts.tokenMint,
            },
            programId,
        );
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
    const instructionData = Buffer.from(getCreateVestingEscrowFromRootInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('06eea16cfc72f65b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
