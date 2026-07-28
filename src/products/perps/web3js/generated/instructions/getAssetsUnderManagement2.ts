import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getOptionEncoder, getStructEncoder, type Encoder, type OptionOrNullable } from '@solana/codecs';
import { getPriceCalcModeEncoder, type PriceCalcModeArgs } from '../types/priceCalcMode';

export interface GetAssetsUnderManagement2InstructionAccounts {
    perpetuals: Address;
    pool: Address;
}

export interface GetAssetsUnderManagement2InstructionArgs {
    mode: OptionOrNullable<PriceCalcModeArgs>;
}

function getGetAssetsUnderManagement2InstructionDataEncoder(): Encoder<GetAssetsUnderManagement2InstructionArgs> {
    return getStructEncoder([['mode', getOptionEncoder(getPriceCalcModeEncoder())]]);
}

export function createGetAssetsUnderManagement2Instruction(
    accounts: GetAssetsUnderManagement2InstructionAccounts,
    args: GetAssetsUnderManagement2InstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getGetAssetsUnderManagement2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('c1d20df971951d54', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
