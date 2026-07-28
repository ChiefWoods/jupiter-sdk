import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface GetExchangeRateLiquidateInstructionAccounts {
    oracle: Address;
}

export interface GetExchangeRateLiquidateInstructionArgs {
    nonce: number;
}

function getGetExchangeRateLiquidateInstructionDataEncoder(): Encoder<GetExchangeRateLiquidateInstructionArgs> {
    return getStructEncoder([['nonce', getU16Encoder()]]);
}

export function createGetExchangeRateLiquidateInstruction(
    accounts: GetExchangeRateLiquidateInstructionAccounts,
    args: GetExchangeRateLiquidateInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [{ pubkey: accounts.oracle, isSigner: false, isWritable: false }];
    const instructionData = Buffer.from(getGetExchangeRateLiquidateInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e4a949275b521b05', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
