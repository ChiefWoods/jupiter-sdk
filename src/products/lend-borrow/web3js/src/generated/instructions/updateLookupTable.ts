import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, transformCodec } from '@solana/codecs';

export interface UpdateLookupTableInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultMetadata: Address;
}

export interface UpdateLookupTableInstructionArgs {
    vaultId: number;
    lookupTable: Address;
}

const UpdateLookupTableInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    [
        'lookupTable',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateLookupTableInstruction(
    accounts: UpdateLookupTableInstructionAccounts,
    args: UpdateLookupTableInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultMetadata, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateLookupTableInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('dd3b1ef66adf8937', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
