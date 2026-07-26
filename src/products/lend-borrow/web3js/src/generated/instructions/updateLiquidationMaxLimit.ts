import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec } from '@solana/codecs';

export interface UpdateLiquidationMaxLimitInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateLiquidationMaxLimitInstructionArgs {
    vaultId: number;
    liquidationMaxLimit: number;
}

const UpdateLiquidationMaxLimitInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['liquidationMaxLimit', getU16Codec()],
]);

export function createUpdateLiquidationMaxLimitInstruction(
    accounts: UpdateLiquidationMaxLimitInstructionAccounts,
    args: UpdateLiquidationMaxLimitInstructionArgs,
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
    const instructionData = Buffer.from(UpdateLiquidationMaxLimitInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b7f29896b02841a1', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
