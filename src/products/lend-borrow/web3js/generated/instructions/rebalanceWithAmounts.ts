import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import {
    getOptionEncoder,
    getStructEncoder,
    getU128Encoder,
    type Encoder,
    type OptionOrNullable,
} from '@solana/codecs';

export interface RebalanceWithAmountsInstructionAccounts {
    rebalancer: Address;
    rebalancerSupplyTokenAccount: Address;
    rebalancerBorrowTokenAccount: Address;
    vaultConfig: Address;
    vaultState: Address;
    supplyToken: Address;
    borrowToken: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
    vaultSupplyPositionOnLiquidity: Address;
    vaultBorrowPositionOnLiquidity: Address;
    supplyRateModel: Address;
    borrowRateModel: Address;
    liquidity: Address;
    liquidityProgram: Address;
    vaultSupplyTokenAccount: Address;
    vaultBorrowTokenAccount: Address;
    systemProgram: Address;
    supplyTokenProgram: Address;
    borrowTokenProgram: Address;
    associatedTokenProgram?: Address;
}

export interface RebalanceWithAmountsInstructionArgs {
    supplyAmount: OptionOrNullable<number | bigint>;
    borrowAmount: OptionOrNullable<number | bigint>;
}

function getRebalanceWithAmountsInstructionDataEncoder(): Encoder<RebalanceWithAmountsInstructionArgs> {
    return getStructEncoder([
        ['supplyAmount', getOptionEncoder(getU128Encoder())],
        ['borrowAmount', getOptionEncoder(getU128Encoder())],
    ]);
}

export function createRebalanceWithAmountsInstruction(
    accounts: RebalanceWithAmountsInstructionAccounts,
    args: RebalanceWithAmountsInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.rebalancer, isSigner: true, isWritable: true },
        { pubkey: accounts.rebalancerSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.rebalancerBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyToken, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowToken, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultSupplyPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowPositionOnLiquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowRateModel, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.liquidityProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultSupplyTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultBorrowTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenProgram, isSigner: false, isWritable: false },
        accounts.associatedTokenProgram
            ? { pubkey: accounts.associatedTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getRebalanceWithAmountsInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('be2190b656048d49', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
