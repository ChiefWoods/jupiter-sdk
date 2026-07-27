import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface RemoveLiquidity2InstructionAccounts {
    owner: Address;
    receivingAccount: Address;
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

export interface RemoveLiquidity2InstructionArgs {
    lpAmountIn: number | bigint;
    minAmountOut: number | bigint;
}

function getRemoveLiquidity2InstructionDataEncoder(): Encoder<RemoveLiquidity2InstructionArgs> {
    return getStructEncoder([
        ['lpAmountIn', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

export function createRemoveLiquidity2Instruction(
    accounts: RemoveLiquidity2InstructionAccounts,
    args: RemoveLiquidity2InstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.receivingAccount, isSigner: false, isWritable: true },
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
    const instructionData = Buffer.from(getRemoveLiquidity2InstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e6d7527ff165e392', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
