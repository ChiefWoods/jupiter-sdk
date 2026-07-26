import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU32Codec, getU64Codec } from '@solana/codecs';

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
    centerPrice: bigint;
    fee: number;
    revenueCut: number;
    upperPercent: number;
    lowerPercent: number;
    upperShiftThreshold: number;
    lowerShiftThreshold: number;
    thresholdShiftTime: number;
    maxCenterPrice: bigint;
    minCenterPrice: bigint;
}

const InitDexInstructionDataCodec = getStructCodec([
    ['centerPrice', getU64Codec()],
    ['fee', getU32Codec()],
    ['revenueCut', getU32Codec()],
    ['upperPercent', getU32Codec()],
    ['lowerPercent', getU32Codec()],
    ['upperShiftThreshold', getU32Codec()],
    ['lowerShiftThreshold', getU32Codec()],
    ['thresholdShiftTime', getU32Codec()],
    ['maxCenterPrice', getU64Codec()],
    ['minCenterPrice', getU64Codec()],
]);

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
    const instructionData = Buffer.from(InitDexInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('debb51305975e6a4', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
