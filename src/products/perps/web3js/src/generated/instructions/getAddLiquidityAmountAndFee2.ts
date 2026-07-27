import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface GetAddLiquidityAmountAndFee2InstructionAccounts {
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    lpTokenMint: Address;
}

export interface GetAddLiquidityAmountAndFee2InstructionArgs {
    tokenAmountIn: number | bigint;
}

function getGetAddLiquidityAmountAndFee2InstructionDataEncoder(): Encoder<GetAddLiquidityAmountAndFee2InstructionArgs> {
    return getStructEncoder([['tokenAmountIn', getU64Encoder()]]);
}

export function createGetAddLiquidityAmountAndFee2Instruction(
    accounts: GetAddLiquidityAmountAndFee2InstructionAccounts,
    args: GetAddLiquidityAmountAndFee2InstructionArgs,
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
    const instructionData = Buffer.from(getGetAddLiquidityAmountAndFee2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('6d9d37a908510476', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
