import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { AddressBool, addressBoolCodec } from '../types/addressBool';
import { ORACLE_PROGRAM_ID } from '..';
import { getArrayCodec, getStructCodec } from '@solana/codecs';

export interface UpdateChainlinkDataStreamsCacheKeepersInstructionAccounts {
    signer: Address;
    oracleAdmin: Address;
    chainlinkDsCache: Address;
}

export interface UpdateChainlinkDataStreamsCacheKeepersInstructionArgs {
    keeperStatus: Array<AddressBool>;
}

const UpdateChainlinkDataStreamsCacheKeepersInstructionDataCodec = getStructCodec([
    ['keeperStatus', getArrayCodec(addressBoolCodec)],
]);

export function createUpdateChainlinkDataStreamsCacheKeepersInstruction(
    accounts: UpdateChainlinkDataStreamsCacheKeepersInstructionAccounts,
    args: UpdateChainlinkDataStreamsCacheKeepersInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.oracleAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.chainlinkDsCache, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateChainlinkDataStreamsCacheKeepersInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('7da8bcbb94cb6657', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
