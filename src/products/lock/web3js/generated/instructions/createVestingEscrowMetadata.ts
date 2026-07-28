import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { addEncoderSizePrefix, getStructEncoder, getU32Encoder, getUtf8Encoder, type Encoder } from '@solana/codecs';
import { findEscrowMetadataPda } from '../pdas/escrowMetadata';

export interface CreateVestingEscrowMetadataInstructionAccounts {
    escrow: Address;
    creator: Address;
    escrowMetadata?: Address;
    payer: Address;
    systemProgram: Address;
}

export interface CreateVestingEscrowMetadataInstructionArgs {
    name: string;
    description: string;
    creatorEmail: string;
    recipientEmail: string;
}

function getCreateVestingEscrowMetadataInstructionDataEncoder(): Encoder<CreateVestingEscrowMetadataInstructionArgs> {
    return getStructEncoder([
        ['name', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['description', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['creatorEmail', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
        ['recipientEmail', addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder())],
    ]);
}

export async function createCreateVestingEscrowMetadataInstruction(
    accounts: CreateVestingEscrowMetadataInstructionAccounts,
    args: CreateVestingEscrowMetadataInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let escrowMetadata = accounts.escrowMetadata;
    if (!escrowMetadata) {
        const [derived] = await findEscrowMetadataPda(
            {
                escrow: accounts.escrow,
            },
            programId,
        );
        escrowMetadata = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        { pubkey: accounts.creator, isSigner: true, isWritable: false },
        { pubkey: escrowMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCreateVestingEscrowMetadataInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('5d4e2167ad7d4600', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
