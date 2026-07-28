import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import {
    fixEncoderSize,
    getBytesEncoder,
    getStructEncoder,
    getU16Encoder,
    transformEncoder,
    type Encoder,
} from '@solana/codecs';

export interface UpdateLookupTableInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultMetadata: Address;
}

export interface UpdateLookupTableInstructionArgs {
    vaultId: number;
    lookupTable: Address;
}

function getUpdateLookupTableInstructionDataEncoder(): Encoder<UpdateLookupTableInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['lookupTable', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createUpdateLookupTableInstruction(
    accounts: UpdateLookupTableInstructionAccounts,
    args: UpdateLookupTableInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultMetadata, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateLookupTableInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('dd3b1ef66adf8937', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
