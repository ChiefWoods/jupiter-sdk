import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec } from '@solana/codecs';

export interface GetExchangeRateOperateInstructionAccounts {
    oracle: Address;
}

export interface GetExchangeRateOperateInstructionArgs {
    nonce: number;
}

const GetExchangeRateOperateInstructionDataCodec = getStructCodec([['nonce', getU16Codec()]]);

export function createGetExchangeRateOperateInstruction(
    accounts: GetExchangeRateOperateInstructionAccounts,
    args: GetExchangeRateOperateInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    const instructionData = Buffer.from(GetExchangeRateOperateInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('aea67e0a7a995ecb', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
