import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { findDexMetadataPda } from '../pdas/dexMetadata';
import { findDexPda } from '../pdas/dex';
import { fixCodecSize, getBytesCodec, getStructCodec, getU16Codec, transformCodec } from '@solana/codecs';

export interface InitDexMetadataInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex?: Address;
    dexMetadata?: Address;
    systemProgram: Address;
}

export interface InitDexMetadataInstructionArgs {
    dexId: number;
    lookupTable: Address;
}

const InitDexMetadataInstructionDataCodec = getStructCodec([
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

export async function createInitDexMetadataInstruction(
    accounts: InitDexMetadataInstructionAccounts,
    args: InitDexMetadataInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let dex = accounts.dex;
    if (!dex) {
        const [derived] = await findDexPda(
            {
                dexId: args.dexId,
            },
            programId,
        );
        dex = derived;
    }
    let dexMetadata = accounts.dexMetadata;
    if (!dexMetadata) {
        const [derived] = await findDexMetadataPda(
            {
                dexId: args.dexId,
            },
            programId,
        );
        dexMetadata = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: dex, isSigner: false, isWritable: false },
        { pubkey: dexMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitDexMetadataInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('72a790dc8f49e008', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
