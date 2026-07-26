import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU32Codec } from '@solana/codecs';

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

const UpdateRangePercentsInstructionDataCodec = getStructCodec([
    ['upperPercent', getU32Codec()],
    ['lowerPercent', getU32Codec()],
    ['shiftTime', getU32Codec()],
]);

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
    const instructionData = Buffer.from(UpdateRangePercentsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('33e9e42b5b073e14', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
