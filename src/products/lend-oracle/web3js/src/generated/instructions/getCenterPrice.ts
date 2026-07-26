import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec } from '@solana/codecs';

export interface GetCenterPriceInstructionAccounts {
    oracle: Address;
}

export interface GetCenterPriceInstructionArgs {
    nonce: number;
}

const GetCenterPriceInstructionDataCodec = getStructCodec([['nonce', getU16Codec()]]);

export function createGetCenterPriceInstruction(
    accounts: GetCenterPriceInstructionAccounts,
    args: GetCenterPriceInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    const instructionData = Buffer.from(GetCenterPriceInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('3c330bf197b4c01b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
