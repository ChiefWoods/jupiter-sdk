import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI16Encoder, getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface UpdateSupplyRateMagnifierInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateSupplyRateMagnifierInstructionArgs {
    vaultId: number;
    supplyRateMagnifier: number;
}

function getUpdateSupplyRateMagnifierInstructionDataEncoder(): Encoder<UpdateSupplyRateMagnifierInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['supplyRateMagnifier', getI16Encoder()],
    ]);
}

export function createUpdateSupplyRateMagnifierInstruction(
    accounts: UpdateSupplyRateMagnifierInstructionAccounts,
    args: UpdateSupplyRateMagnifierInstructionArgs,
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
    const instructionData = Buffer.from(getUpdateSupplyRateMagnifierInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('af3b75c4d3aa160c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
