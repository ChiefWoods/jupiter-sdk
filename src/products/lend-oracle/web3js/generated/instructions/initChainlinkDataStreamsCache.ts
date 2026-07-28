import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { findChainlinkDsCachePda } from '../pdas/chainlinkDsCache';
import {
    fixEncoderSize,
    getArrayEncoder,
    getBytesEncoder,
    getStructEncoder,
    getU16Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';
import { getFeedEntryEncoder, type FeedEntryArgs } from '../types/feedEntry';

export interface InitChainlinkDataStreamsCacheInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache?: Address;
    systemProgram: Address;
}

export interface InitChainlinkDataStreamsCacheInstructionArgs {
    nonce: number;
    feeds: Array<FeedEntryArgs>;
    keepers: Array<Address>;
}

function getInitChainlinkDataStreamsCacheInstructionDataEncoder(): Encoder<InitChainlinkDataStreamsCacheInstructionArgs> {
    return getStructEncoder([
        ['nonce', getU16Encoder()],
        ['feeds', getArrayEncoder(getFeedEntryEncoder())],
        [
            'keepers',
            getArrayEncoder(
                transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
            ),
        ],
    ]);
}

export async function createInitChainlinkDataStreamsCacheInstruction(
    accounts: InitChainlinkDataStreamsCacheInstructionAccounts,
    args: InitChainlinkDataStreamsCacheInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let chainlinkDsCache = accounts.chainlinkDsCache;
    if (!chainlinkDsCache) {
        const [derived] = await findChainlinkDsCachePda(
            {
                nonce: args.nonce,
            },
            programId,
        );
        chainlinkDsCache = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: chainlinkDsCache, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitChainlinkDataStreamsCacheInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('2faecebd5efd19e9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
