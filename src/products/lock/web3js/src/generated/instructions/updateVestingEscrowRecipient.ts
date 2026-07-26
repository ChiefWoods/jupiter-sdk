import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LOCKER_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBytesCodec,
    getOptionCodec,
    getStructCodec,
    getU32Codec,
    getUtf8Codec,
    transformCodec,
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
    newRecipientEmail: string | null;
}

const UpdateVestingEscrowRecipientInstructionDataCodec = getStructCodec([
    [
        'newRecipient',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    ['newRecipientEmail', getOptionCodec(addCodecSizePrefix(getUtf8Codec(), getU32Codec()))],
]);

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
    const instructionData = Buffer.from(UpdateVestingEscrowRecipientInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('1af27fffed6d2fce', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
