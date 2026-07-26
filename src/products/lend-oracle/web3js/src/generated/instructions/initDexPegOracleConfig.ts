import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DexPegOracleKind, dexPegOracleKindCodec } from '../types/dexPegOracleKind';
import { ORACLE_PROGRAM_ID } from '..';
import { Sources, sourcesCodec } from '../types/sources';
import { findDexPegConfigPda } from '../pdas/dexPegConfig';
import { getBooleanCodec, getStructCodec, getU128Codec, getU16Codec } from '@solana/codecs';

export interface InitDexPegOracleConfigInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    dexPegConfig?: Address;
    dex: Address;
    positionToken0: Address;
    positionToken1: Address;
    tokenReserve0: Address;
    tokenReserve1: Address;
    systemProgram: Address;
}

export interface InitDexPegOracleConfigInstructionArgs {
    nonce: number;
    kind: DexPegOracleKind;
    pegBufferPercent: bigint;
    quoteInToken0: boolean;
    conversionSource: Sources;
}

const InitDexPegOracleConfigInstructionDataCodec = getStructCodec([
    ['nonce', getU16Codec()],
    ['kind', dexPegOracleKindCodec],
    ['pegBufferPercent', getU128Codec()],
    ['quoteInToken0', getBooleanCodec()],
    ['conversionSource', sourcesCodec],
]);

export async function createInitDexPegOracleConfigInstruction(
    accounts: InitDexPegOracleConfigInstructionAccounts,
    args: InitDexPegOracleConfigInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let dexPegConfig = accounts.dexPegConfig;
    if (!dexPegConfig) {
        const [derived] = await findDexPegConfigPda(
            {
                nonce: args.nonce,
            },
            programId,
        );
        dexPegConfig = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: dexPegConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.positionToken0, isSigner: false, isWritable: false },
        { pubkey: accounts.positionToken1, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve0, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve1, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitDexPegOracleConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('a39eb44ac9360730', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
