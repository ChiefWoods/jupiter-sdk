import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { findDepositorTokenAccountPda } from '../pdas/depositorTokenAccount';
import { getOptionEncoder, getStructEncoder, getU64Encoder, type Encoder, type OptionOrNullable } from '@solana/codecs';

export interface RebalanceWithAmountsInstructionAccounts {
    signer: Address;
    depositorTokenAccount?: Address;
    lendingAdmin: Address;
    lending: Address;
    mint: Address;
    fTokenMint: Address;
    supplyTokenReservesLiquidity: Address;
    lendingSupplyPositionOnLiquidity: Address;
    rateModel: Address;
    vault: Address;
    liquidity: Address;
    liquidityProgram: Address;
    rewardsRateModel: Address;
    tokenProgram: Address;
    associatedTokenProgram: Address;
    systemProgram: Address;
}

export interface RebalanceWithAmountsInstructionArgs {
    amount: OptionOrNullable<number | bigint>;
}

function getRebalanceWithAmountsInstructionDataEncoder(): Encoder<RebalanceWithAmountsInstructionArgs> {
    return getStructEncoder([['amount', getOptionEncoder(getU64Encoder())]]);
}

export async function createRebalanceWithAmountsInstruction(
    accounts: RebalanceWithAmountsInstructionAccounts,
    args: RebalanceWithAmountsInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let depositorTokenAccount = accounts.depositorTokenAccount;
    if (!depositorTokenAccount) {
        const [derived] = await findDepositorTokenAccountPda(
            {
                signer: accounts.signer,
                tokenProgram: accounts.tokenProgram,
                mint: accounts.mint,
            },
            programId,
        );
        depositorTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: depositorTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.lending, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.fTokenMint, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.lendingSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.rateModel, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rewardsRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getRebalanceWithAmountsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('be2190b656048d49', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
