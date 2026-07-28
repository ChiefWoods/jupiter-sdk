import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { findDexPegConfigPda } from '../pdas/dexPegConfig';
import { getBooleanEncoder, getStructEncoder, getU128Encoder, getU16Encoder, type Encoder } from '@solana/codecs';
import { getDexPegOracleKindEncoder, type DexPegOracleKindArgs } from '../types/dexPegOracleKind';
import { getSourcesEncoder, type SourcesArgs } from '../types/sources';

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
    kind: DexPegOracleKindArgs;
    pegBufferPercent: number | bigint;
    quoteInToken0: boolean;
    conversionSource: SourcesArgs;
}

function getInitDexPegOracleConfigInstructionDataEncoder(): Encoder<InitDexPegOracleConfigInstructionArgs> {
    return getStructEncoder([
        ['nonce', getU16Encoder()],
        ['kind', getDexPegOracleKindEncoder()],
        ['pegBufferPercent', getU128Encoder()],
        ['quoteInToken0', getBooleanEncoder()],
        ['conversionSource', getSourcesEncoder()],
    ]);
}

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
    const instructionData = Buffer.from(getInitDexPegOracleConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a39eb44ac9360730', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
