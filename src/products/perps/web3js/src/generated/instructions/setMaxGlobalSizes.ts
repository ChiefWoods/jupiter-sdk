import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU64Encoder,
    getU8Encoder,
    type Encoder,
    type ReadonlyUint8Array,
} from '@solana/codecs';

export interface SetMaxGlobalSizesInstructionAccounts {
    keeper: Address;
    custody: Address;
    pool: Address;
}

export interface SetMaxGlobalSizesInstructionArgs {
    maxGlobalLongSize: number | bigint;
    maxGlobalShortSize: number | bigint;
    recoveryId: number;
    signature: ReadonlyUint8Array;
    referenceId: ReadonlyUint8Array;
    timestamp: number | bigint;
}

function getSetMaxGlobalSizesInstructionDataEncoder(): Encoder<SetMaxGlobalSizesInstructionArgs> {
    return getStructEncoder([
        ['maxGlobalLongSize', getU64Encoder()],
        ['maxGlobalShortSize', getU64Encoder()],
        ['recoveryId', getU8Encoder()],
        ['signature', fixEncoderSize(getBytesEncoder(), 64)],
        ['referenceId', fixEncoderSize(getBytesEncoder(), 16)],
        ['timestamp', getU64Encoder()],
    ]);
}

export function createSetMaxGlobalSizesInstruction(
    accounts: SetMaxGlobalSizesInstructionAccounts,
    args: SetMaxGlobalSizesInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.keeper, isSigner: true, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getSetMaxGlobalSizesInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('5902d218a7e30dd6', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
