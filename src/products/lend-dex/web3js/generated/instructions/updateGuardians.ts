import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getAddressBoolEncoder, type AddressBoolArgs } from '../types/addressBool';
import { getArrayEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface UpdateGuardiansInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
}

export interface UpdateGuardiansInstructionArgs {
    guardianStatus: Array<AddressBoolArgs>;
}

function getUpdateGuardiansInstructionDataEncoder(): Encoder<UpdateGuardiansInstructionArgs> {
    return getStructEncoder([['guardianStatus', getArrayEncoder(getAddressBoolEncoder())]]);
}

export function createUpdateGuardiansInstruction(
    accounts: UpdateGuardiansInstructionAccounts,
    args: UpdateGuardiansInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateGuardiansInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('2b3efa8a8d758461', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
