import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getAddressU8Encoder, type AddressU8Args } from '../types/addressU8';
import { getArrayEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface UpdateUserClassInstructionAccounts {
    authority: Address;
    authList: Address;
}

export interface UpdateUserClassInstructionArgs {
    userClass: Array<AddressU8Args>;
}

function getUpdateUserClassInstructionDataEncoder(): Encoder<UpdateUserClassInstructionArgs> {
    return getStructEncoder([['userClass', getArrayEncoder(getAddressU8Encoder())]]);
}

export function createUpdateUserClassInstruction(
    accounts: UpdateUserClassInstructionAccounts,
    args: UpdateUserClassInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateUserClassInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('0cce44873fd43077', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
