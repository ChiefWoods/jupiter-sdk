import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getI64Codec, getStructCodec } from '@solana/codecs';

export interface PreviewDexSharesInstructionAccounts {
    dex: Address;
    position: Address;
    token0Reserve: Address;
    token1Reserve: Address;
    dexSupplyPositionToken0?: Address;
    dexSupplyPositionToken1?: Address;
    dexBorrowPositionToken0?: Address;
    dexBorrowPositionToken1?: Address;
    oracleProgram: Address;
}

export interface PreviewDexSharesInstructionArgs {
    colToken0: bigint;
    colToken1: bigint;
    debtToken0: bigint;
    debtToken1: bigint;
}

const PreviewDexSharesInstructionDataCodec = getStructCodec([
    ['colToken0', getI64Codec()],
    ['colToken1', getI64Codec()],
    ['debtToken0', getI64Codec()],
    ['debtToken1', getI64Codec()],
]);

export function createPreviewDexSharesInstruction(
    accounts: PreviewDexSharesInstructionAccounts,
    args: PreviewDexSharesInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: false },
        { pubkey: accounts.token0Reserve, isSigner: false, isWritable: false },
        { pubkey: accounts.token1Reserve, isSigner: false, isWritable: false },
        accounts.dexSupplyPositionToken0
            ? { pubkey: accounts.dexSupplyPositionToken0, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexSupplyPositionToken1
            ? { pubkey: accounts.dexSupplyPositionToken1, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken0
            ? { pubkey: accounts.dexBorrowPositionToken0, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        accounts.dexBorrowPositionToken1
            ? { pubkey: accounts.dexBorrowPositionToken1, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.oracleProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(PreviewDexSharesInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('f66132ab3f8e3ee5', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
