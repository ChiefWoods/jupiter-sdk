import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU32Encoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface InitDexInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    dexMetadata: Address;
    token0: Address;
    token1: Address;
    systemProgram: Address;
}

export interface InitDexInstructionArgs {
    centerPrice: number | bigint;
    fee: number;
    revenueCut: number;
    upperPercent: number;
    lowerPercent: number;
    upperShiftThreshold: number;
    lowerShiftThreshold: number;
    thresholdShiftTime: number;
    maxCenterPrice: number | bigint;
    minCenterPrice: number | bigint;
}

function getInitDexInstructionDataEncoder(): Encoder<InitDexInstructionArgs> {
    return getStructEncoder([
        ['centerPrice', getU64Encoder()],
        ['fee', getU32Encoder()],
        ['revenueCut', getU32Encoder()],
        ['upperPercent', getU32Encoder()],
        ['lowerPercent', getU32Encoder()],
        ['upperShiftThreshold', getU32Encoder()],
        ['lowerShiftThreshold', getU32Encoder()],
        ['thresholdShiftTime', getU32Encoder()],
        ['maxCenterPrice', getU64Encoder()],
        ['minCenterPrice', getU64Encoder()],
    ]);
}

export function createInitDexInstruction(
    accounts: InitDexInstructionAccounts,
    args: InitDexInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
        { pubkey: accounts.dexMetadata, isSigner: false, isWritable: true },
        { pubkey: accounts.token0, isSigner: false, isWritable: false },
        { pubkey: accounts.token1, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitDexInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('debb51305975e6a4', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
