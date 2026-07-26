import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { AddressBool, addressBoolCodec } from '../types/addressBool';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getArrayCodec, getStructCodec } from '@solana/codecs';

export interface UpdateAuthsInstructionAccounts {
    authority: Address;
    liquidity: Address;
    authList: Address;
}

export interface UpdateAuthsInstructionArgs {
    authStatus: Array<AddressBool>;
}

const UpdateAuthsInstructionDataCodec = getStructCodec([['authStatus', getArrayCodec(addressBoolCodec)]]);

export function createUpdateAuthsInstruction(
    accounts: UpdateAuthsInstructionAccounts,
    args: UpdateAuthsInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateAuthsInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('5d60b29c3975fdd1', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
