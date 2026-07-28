import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface UpdateWithdrawGapInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateWithdrawGapInstructionArgs {
    vaultId: number;
    withdrawGap: number;
}

function getUpdateWithdrawGapInstructionDataEncoder(): Encoder<UpdateWithdrawGapInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['withdrawGap', getU16Encoder()],
    ]);
}

export function createUpdateWithdrawGapInstruction(
    accounts: UpdateWithdrawGapInstructionAccounts,
    args: UpdateWithdrawGapInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getUpdateWithdrawGapInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('e5a34c1552d719e9', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
