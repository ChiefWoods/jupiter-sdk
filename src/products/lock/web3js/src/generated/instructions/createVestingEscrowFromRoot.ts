import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { RemainingAccountsInfo, remainingAccountsInfoCodec } from '../types/remainingAccountsInfo';
import { findBasePda } from '../pdas/base';
import { findEscrowPda } from '../pdas/escrow';
import { findEscrowTokenPda } from '../pdas/escrowToken';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findRootEscrowTokenPda } from '../pdas/rootEscrowToken';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getOptionCodec,
    getStructCodec,
    getU64Codec,
    getU8Codec,
} from '@solana/codecs';

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
    vestingStartTime: bigint;
    cliffTime: bigint;
    frequency: bigint;
    cliffUnlockAmount: bigint;
    amountPerPeriod: bigint;
    numberOfPeriod: bigint;
    updateRecipientMode: number;
    cancelMode: number;
    proof: Array<Uint8Array>;
    remainingAccountsInfo: RemainingAccountsInfo | null;
}

const CreateVestingEscrowFromRootInstructionDataCodec = getStructCodec([
    ['vestingStartTime', getU64Codec()],
    ['cliffTime', getU64Codec()],
    ['frequency', getU64Codec()],
    ['cliffUnlockAmount', getU64Codec()],
    ['amountPerPeriod', getU64Codec()],
    ['numberOfPeriod', getU64Codec()],
    ['updateRecipientMode', getU8Codec()],
    ['cancelMode', getU8Codec()],
    ['proof', getArrayCodec(fixCodecSize(getBytesCodec(), 32))],
    ['remainingAccountsInfo', getOptionCodec(remainingAccountsInfoCodec)],
]);

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
    const instructionData = Buffer.from(CreateVestingEscrowFromRootInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('06eea16cfc72f65b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
