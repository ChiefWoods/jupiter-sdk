import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { FeedEntry, feedEntryCodec } from '../types/feedEntry';
import { ORACLE_PROGRAM_ID } from '..';
import { findChainlinkDsCachePda } from '../pdas/chainlinkDsCache';
import {
    fixCodecSize,
    getArrayCodec,
    getBytesCodec,
    getStructCodec,
    getU16Codec,
    transformCodec,
} from '@solana/codecs';

export interface InitChainlinkDataStreamsCacheInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache?: Address;
    systemProgram: Address;
}

export interface InitChainlinkDataStreamsCacheInstructionArgs {
    nonce: number;
    feeds: Array<FeedEntry>;
    keepers: Array<Address>;
}

const InitChainlinkDataStreamsCacheInstructionDataCodec = getStructCodec([
    ['nonce', getU16Codec()],
    ['feeds', getArrayCodec(feedEntryCodec)],
    [
        'keepers',
        getArrayCodec(
            transformCodec(
                fixCodecSize(getBytesCodec(), 32),
                (value: Address) => value.toBytes(),
                value => new Address(value),
            ),
        ),
    ],
]);

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
    const instructionData = Buffer.from(InitChainlinkDataStreamsCacheInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('2faecebd5efd19e9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
