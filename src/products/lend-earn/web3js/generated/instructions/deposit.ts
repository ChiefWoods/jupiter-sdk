import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface DepositInstructionAccounts {
    signer: Address;
    depositorTokenAccount: Address;
    recipientTokenAccount: Address;
    mint: Address;
    lendingAdmin: Address;
    lending: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingSupplyPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    liquidity: Address;
    liquidityProgram: Address;
    rewardsRateModel: Address;
    tokenProgram: Address;
    associatedTokenProgram?: Address;
    systemProgram: Address;
}

export interface DepositInstructionArgs {
    assets: number | bigint;
}

function getDepositInstructionDataEncoder(): Encoder<DepositInstructionArgs> {
    return getStructEncoder([['assets', getU64Encoder()]]);
}

export function createDepositInstruction(
    accounts: DepositInstructionAccounts,
    args: DepositInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.depositorTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.recipientTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getDepositInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('f223c68952e1f2b6', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
