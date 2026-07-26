import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface UpdateAuthorityInstructionAccounts {
    authority: Address;
    lendingRewardsAdmin: Address;
}

export interface UpdateAuthorityInstructionArgs {
    newAuthority: Address;
}

const UpdateAuthorityInstructionDataCodec = getStructCodec([
    [
        'newAuthority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateAuthorityInstruction(
    accounts: UpdateAuthorityInstructionAccounts,
    args: UpdateAuthorityInstructionArgs,
    programId: Address = LENDINGREWARDRATEMODEL_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.lendingRewardsAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateAuthorityInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('202e401c954bf358', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
