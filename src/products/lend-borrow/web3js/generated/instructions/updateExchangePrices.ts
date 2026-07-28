import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface UpdateExchangePricesInstructionAccounts {
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateExchangePricesInstructionArgs {
    vaultId: number;
}

function getUpdateExchangePricesInstructionDataEncoder(): Encoder<UpdateExchangePricesInstructionArgs> {
    return getStructEncoder([['vaultId', getU16Encoder()]]);
}

export function createUpdateExchangePricesInstruction(
    accounts: UpdateExchangePricesInstructionAccounts,
    args: UpdateExchangePricesInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getUpdateExchangePricesInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('d10ebc5ff21477c4', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
