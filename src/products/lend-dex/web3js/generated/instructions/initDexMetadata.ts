import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { findDexMetadataPda } from '../pdas/dexMetadata';
import { findDexPda } from '../pdas/dex';
import {
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU16Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';

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

function getInitDexMetadataInstructionDataEncoder(): Encoder<InitDexMetadataInstructionArgs> {
    return getStructEncoder([
        ['dexId', getU16Encoder()],
        ['lookupTable', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

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
    const instructionData = Buffer.from(getInitDexMetadataInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('72a790dc8f49e008', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
