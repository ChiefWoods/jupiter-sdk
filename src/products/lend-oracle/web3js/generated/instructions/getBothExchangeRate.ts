import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface GetBothExchangeRateInstructionAccounts {
    oracle: Address;
}

export interface GetBothExchangeRateInstructionArgs {
    nonce: number;
}

function getGetBothExchangeRateInstructionDataEncoder(): Encoder<GetBothExchangeRateInstructionArgs> {
    return getStructEncoder([['nonce', getU16Encoder()]]);
}

export function createGetBothExchangeRateInstruction(
    accounts: GetBothExchangeRateInstructionAccounts,
    args: GetBothExchangeRateInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    const instructionData = Buffer.from(getGetBothExchangeRateInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('5c58a12ee6c12eed', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
