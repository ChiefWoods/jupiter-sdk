import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU32Encoder, type Encoder } from '@solana/codecs';

export interface UpdateRangePercentsInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateRangePercentsInstructionArgs {
    upperPercent: number;
    lowerPercent: number;
    shiftTime: number;
}

function getUpdateRangePercentsInstructionDataEncoder(): Encoder<UpdateRangePercentsInstructionArgs> {
    return getStructEncoder([
        ['upperPercent', getU32Encoder()],
        ['lowerPercent', getU32Encoder()],
        ['shiftTime', getU32Encoder()],
    ]);
}

export function createUpdateRangePercentsInstruction(
    accounts: UpdateRangePercentsInstructionAccounts,
    args: UpdateRangePercentsInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateRangePercentsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('33e9e42b5b073e14', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
