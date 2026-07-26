import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, transformCodec } from '@solana/codecs';

export interface UpdateDexLookupTableInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dexMetadata: Address;
}

export interface UpdateDexLookupTableInstructionArgs {
    dexId: number;
    lookupTable: Address;
}

const UpdateDexLookupTableInstructionDataCodec = getStructCodec([
    ['dexId', getU16Codec()],
    [
        'lookupTable',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export function createUpdateDexLookupTableInstruction(
    accounts: UpdateDexLookupTableInstructionAccounts,
    args: UpdateDexLookupTableInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dexMetadata, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateDexLookupTableInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('5795605f1814d32b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
