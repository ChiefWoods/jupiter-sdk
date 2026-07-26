import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { AddressU8, addressU8Codec } from '../types/addressU8';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getArrayCodec, getStructCodec } from '@solana/codecs';

export interface UpdateUserClassInstructionAccounts {
    authority: Address;
    authList: Address;
}

export interface UpdateUserClassInstructionArgs {
    userClass: Array<AddressU8>;
}

const UpdateUserClassInstructionDataCodec = getStructCodec([['userClass', getArrayCodec(addressU8Codec)]]);

export function createUpdateUserClassInstruction(
    accounts: UpdateUserClassInstructionAccounts,
    args: UpdateUserClassInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateUserClassInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('0cce44873fd43077', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
