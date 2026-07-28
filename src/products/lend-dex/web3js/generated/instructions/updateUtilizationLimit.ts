import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface UpdateUtilizationLimitInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateUtilizationLimitInstructionArgs {
    token0UtilizationLimit: number;
    token1UtilizationLimit: number;
}

function getUpdateUtilizationLimitInstructionDataEncoder(): Encoder<UpdateUtilizationLimitInstructionArgs> {
    return getStructEncoder([
        ['token0UtilizationLimit', getU16Encoder()],
        ['token1UtilizationLimit', getU16Encoder()],
    ]);
}

export function createUpdateUtilizationLimitInstruction(
    accounts: UpdateUtilizationLimitInstructionAccounts,
    args: UpdateUtilizationLimitInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateUtilizationLimitInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('309100eb763b37cf', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
