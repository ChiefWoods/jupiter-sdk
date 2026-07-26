import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getI16Codec, getStructCodec, getU16Codec } from '@solana/codecs';

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

const UpdateSupplyRateMagnifierInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['supplyRateMagnifier', getI16Codec()],
]);

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
    const instructionData = Buffer.from(UpdateSupplyRateMagnifierInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('af3b75c4d3aa160c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
