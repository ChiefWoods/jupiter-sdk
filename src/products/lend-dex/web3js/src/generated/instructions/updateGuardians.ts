import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { AddressBool, addressBoolCodec } from '../types/addressBool';
import { DEX_PROGRAM_ID } from '..';
import { getArrayCodec, getStructCodec } from '@solana/codecs';

export interface UpdateGuardiansInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
}

export interface UpdateGuardiansInstructionArgs {
    guardianStatus: Array<AddressBool>;
}

const UpdateGuardiansInstructionDataCodec = getStructCodec([['guardianStatus', getArrayCodec(addressBoolCodec)]]);

export function createUpdateGuardiansInstruction(
    accounts: UpdateGuardiansInstructionAccounts,
    args: UpdateGuardiansInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateGuardiansInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('2b3efa8a8d758461', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
