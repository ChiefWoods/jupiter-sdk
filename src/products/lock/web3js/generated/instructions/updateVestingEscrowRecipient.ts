import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import {
    addEncoderSizePrefix,
    fixEncoderSize,
    getBytesEncoder,
    getOptionEncoder,
    getStructEncoder,
    getU32Encoder,
    getUtf8Encoder,
    transformEncoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';
import { findEventAuthorityPda } from '../pdas/eventAuthority';

export interface UpdateVestingEscrowRecipientInstructionAccounts {
    escrow: Address;
    escrowMetadata?: Address;
    signer: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface UpdateVestingEscrowRecipientInstructionArgs {
    newRecipient: Address;
    newRecipientEmail: OptionOrNullable<string>;
}

function getUpdateVestingEscrowRecipientInstructionDataEncoder(): Encoder<UpdateVestingEscrowRecipientInstructionArgs> {
    return getStructEncoder([
        ['newRecipient', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['newRecipientEmail', getOptionEncoder(addEncoderSizePrefix(getUtf8Encoder(), getU32Encoder()))],
    ]);
}

export async function createUpdateVestingEscrowRecipientInstruction(
    accounts: UpdateVestingEscrowRecipientInstructionAccounts,
    args: UpdateVestingEscrowRecipientInstructionArgs,
    programId: Address = LOCKER_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.escrow, isSigner: false, isWritable: true },
        accounts.escrowMetadata
            ? { pubkey: accounts.escrowMetadata, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getUpdateVestingEscrowRecipientInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('1af27fffed6d2fce', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
