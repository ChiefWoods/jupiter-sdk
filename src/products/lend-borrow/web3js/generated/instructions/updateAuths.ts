import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getAddressBoolEncoder, type AddressBoolArgs } from '../types/addressBool';
import { getArrayEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface UpdateAuthsInstructionAccounts {
    signer: Address;
    vaultAdmin: Address;
}

export interface UpdateAuthsInstructionArgs {
    authStatus: Array<AddressBoolArgs>;
}

function getUpdateAuthsInstructionDataEncoder(): Encoder<UpdateAuthsInstructionArgs> {
    return getStructEncoder([['authStatus', getArrayEncoder(getAddressBoolEncoder())]]);
}

export function createUpdateAuthsInstruction(
    accounts: UpdateAuthsInstructionAccounts,
    args: UpdateAuthsInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateAuthsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('5d60b29c3975fdd1', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
