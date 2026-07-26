import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { fixCodecSize, getBytesCodec, getStructCodec, getU64Codec } from '@solana/codecs';

export interface CreateRootEscrowInstructionAccounts {
    base: Address;
    rootEscrow: Address;
    tokenMint: Address;
    payer: Address;
    creator: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface CreateRootEscrowInstructionArgs {
    maxClaimAmount: bigint;
    maxEscrow: bigint;
    version: bigint;
    root: Uint8Array;
}

const CreateRootEscrowInstructionDataCodec = getStructCodec([
    ['maxClaimAmount', getU64Codec()],
    ['maxEscrow', getU64Codec()],
    ['version', getU64Codec()],
    ['root', fixCodecSize(getBytesCodec(), 32)],
]);

export async function createCreateRootEscrowInstruction(
    accounts: CreateRootEscrowInstructionAccounts,
    args: CreateRootEscrowInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.base, isSigner: true, isWritable: false },
        { pubkey: accounts.rootEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenMint, isSigner: false, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.creator, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(CreateRootEscrowInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('74d40cbc4de220c9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
