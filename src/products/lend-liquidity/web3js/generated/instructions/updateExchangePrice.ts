import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface UpdateExchangePriceInstructionAccounts {
    tokenReserve: Address;
    rateModel: Address;
}

export interface UpdateExchangePriceInstructionArgs {
    mint: Address;
}

function getUpdateExchangePriceInstructionDataEncoder(): Encoder<UpdateExchangePriceInstructionArgs> {
    return getStructEncoder([
        ['mint', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export function createUpdateExchangePriceInstruction(
    accounts: UpdateExchangePriceInstructionAccounts,
    args: UpdateExchangePriceInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getUpdateExchangePriceInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('eff40af874193596', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
