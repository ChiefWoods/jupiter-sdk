import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface WithdrawWithMaxSharesBurnInstructionAccounts {
    signer: Address;
    ownerTokenAccount: Address;
    recipientTokenAccount: Address;
    lendingAdmin: Address;
    lending: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingSupplyPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    claimAccount?: Address;
    liquidity: Address;
    liquidityProgram: Address;
    rewardsRateModel: Address;
    tokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
}

export interface WithdrawWithMaxSharesBurnInstructionArgs {
    amount: number | bigint;
    maxSharesBurn: number | bigint;
}

function getWithdrawWithMaxSharesBurnInstructionDataEncoder(): Encoder<WithdrawWithMaxSharesBurnInstructionArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['maxSharesBurn', getU64Encoder()],
    ]);
}

export function createWithdrawWithMaxSharesBurnInstruction(
    accounts: WithdrawWithMaxSharesBurnInstructionAccounts,
    args: WithdrawWithMaxSharesBurnInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.recipientTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        accounts.claimAccount
            ? { pubkey: accounts.claimAccount, isSigner: false, isWritable: true }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getWithdrawWithMaxSharesBurnInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('2fc5b7abef12f5ab', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
