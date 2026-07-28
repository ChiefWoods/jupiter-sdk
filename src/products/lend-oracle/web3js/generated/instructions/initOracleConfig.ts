import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { findOraclePda } from '../pdas/oracle';
import { getArrayEncoder, getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';
import { getSourcesEncoder, type SourcesArgs } from '../types/sources';

export interface InitOracleConfigInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    oracle?: Address;
    systemProgram: Address;
}

export interface InitOracleConfigInstructionArgs {
    sources: Array<SourcesArgs>;
    nonce: number;
}

function getInitOracleConfigInstructionDataEncoder(): Encoder<InitOracleConfigInstructionArgs> {
    return getStructEncoder([
        ['sources', getArrayEncoder(getSourcesEncoder())],
        ['nonce', getU16Encoder()],
    ]);
}

export async function createInitOracleConfigInstruction(
    accounts: InitOracleConfigInstructionAccounts,
    args: InitOracleConfigInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let oracle = accounts.oracle;
    if (!oracle) {
        const [derived] = await findOraclePda(
            {
                nonce: args.nonce,
            },
            programId,
        );
        oracle = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: oracle, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitOracleConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('4d90b4f6d90f765c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
