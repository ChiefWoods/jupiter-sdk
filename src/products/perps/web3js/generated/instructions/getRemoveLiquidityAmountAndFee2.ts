import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface GetRemoveLiquidityAmountAndFee2InstructionAccounts {
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    lpTokenMint: Address;
}

export interface GetRemoveLiquidityAmountAndFee2InstructionArgs {
    lpAmountIn: number | bigint;
}

function getGetRemoveLiquidityAmountAndFee2InstructionDataEncoder(): Encoder<GetRemoveLiquidityAmountAndFee2InstructionArgs> {
    return getStructEncoder([['lpAmountIn', getU64Encoder()]]);
}

export function createGetRemoveLiquidityAmountAndFee2Instruction(
    accounts: GetRemoveLiquidityAmountAndFee2InstructionAccounts,
    args: GetRemoveLiquidityAmountAndFee2InstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: false },
        { pubkey: accounts.custody, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getGetRemoveLiquidityAmountAndFee2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b73b486edff3968e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
