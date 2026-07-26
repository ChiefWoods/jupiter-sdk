import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import { addCodecSizePrefix, getStructCodec, getU32Codec, getUtf8Codec } from '@solana/codecs';
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

const CreateVestingEscrowMetadataInstructionDataCodec = getStructCodec([
    ['name', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['description', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['creatorEmail', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    ['recipientEmail', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
]);

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
    const instructionData = Buffer.from(CreateVestingEscrowMetadataInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('5d4e2167ad7d4600', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
