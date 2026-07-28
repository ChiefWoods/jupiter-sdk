import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getOptionEncoder, getStructEncoder, getU64Encoder, type Encoder, type OptionOrNullable } from '@solana/codecs';

export interface AddLiquidity2InstructionAccounts {
    owner: Address;
    fundingAccount: Address;
    lpTokenAccount: Address;
    transferAuthority: Address;
    perpetuals: Address;
    pool: Address;
    custody: Address;
    custodyDovesPriceAccount: Address;
    custodyPythnetPriceAccount: Address;
    custodyTokenAccount: Address;
    lpTokenMint: Address;
    tokenProgram: Address;
    eventAuthority: Address;
    program: Address;
}

export interface AddLiquidity2InstructionArgs {
    tokenAmountIn: number | bigint;
    minLpAmountOut: number | bigint;
    tokenAmountPreSwap: OptionOrNullable<number | bigint>;
}

function getAddLiquidity2InstructionDataEncoder(): Encoder<AddLiquidity2InstructionArgs> {
    return getStructEncoder([
        ['tokenAmountIn', getU64Encoder()],
        ['minLpAmountOut', getU64Encoder()],
        ['tokenAmountPreSwap', getOptionEncoder(getU64Encoder())],
    ]);
}

export function createAddLiquidity2Instruction(
    accounts: AddLiquidity2InstructionAccounts,
    args: AddLiquidity2InstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.fundingAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.transferAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: false },
        { pubkey: accounts.pool, isSigner: false, isWritable: true },
        { pubkey: accounts.custody, isSigner: false, isWritable: true },
        { pubkey: accounts.custodyDovesPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyPythnetPriceAccount, isSigner: false, isWritable: false },
        { pubkey: accounts.custodyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getAddLiquidity2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e4a24e1c46db7473', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
