import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec } from '@solana/codecs';

export interface GetExchangeRateInstructionAccounts {
    oracle: Address;
}

export interface GetExchangeRateInstructionArgs {
    nonce: number;
}

const GetExchangeRateInstructionDataCodec = getStructCodec([['nonce', getU16Codec()]]);

export function createGetExchangeRateInstruction(
    accounts: GetExchangeRateInstructionAccounts,
    args: GetExchangeRateInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    const instructionData = Buffer.from(GetExchangeRateInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('994c11c2aad7598e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
