import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getRateDataV1ParamsEncoder, type RateDataV1ParamsArgs } from '../types/rateDataV1Params';
import { getStructEncoder, type Encoder } from '@solana/codecs';

export interface UpdateRateDataV1InstructionAccounts {
    authority: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
}

export interface UpdateRateDataV1InstructionArgs {
    rateData: RateDataV1ParamsArgs;
}

function getUpdateRateDataV1InstructionDataEncoder(): Encoder<UpdateRateDataV1InstructionArgs> {
    return getStructEncoder([['rateData', getRateDataV1ParamsEncoder()]]);
}

export function createUpdateRateDataV1Instruction(
    accounts: UpdateRateDataV1InstructionAccounts,
    args: UpdateRateDataV1InstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateRateDataV1InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('0614227a1696b416', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
