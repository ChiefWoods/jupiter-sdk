import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getRateDataV2ParamsEncoder, type RateDataV2ParamsArgs } from '../types/rateDataV2Params';
import { getStructEncoder, type Encoder } from '@solana/codecs';

export interface UpdateRateDataV2InstructionAccounts {
    authority: Address;
    authList: Address;
    rateModel: Address;
    mint: Address;
    tokenReserve: Address;
}

export interface UpdateRateDataV2InstructionArgs {
    rateData: RateDataV2ParamsArgs;
}

function getUpdateRateDataV2InstructionDataEncoder(): Encoder<UpdateRateDataV2InstructionArgs> {
    return getStructEncoder([['rateData', getRateDataV2ParamsEncoder()]]);
}

export function createUpdateRateDataV2Instruction(
    accounts: UpdateRateDataV2InstructionAccounts,
    args: UpdateRateDataV2InstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenReserve, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateRateDataV2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('74493592d82de47c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
