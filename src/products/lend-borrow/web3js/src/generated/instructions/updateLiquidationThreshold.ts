import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec } from '@solana/codecs';

export interface UpdateLiquidationThresholdInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateLiquidationThresholdInstructionArgs {
    vaultId: number;
    liquidationThreshold: number;
}

const UpdateLiquidationThresholdInstructionDataCodec = getStructCodec([
    ['vaultId', getU16Codec()],
    ['liquidationThreshold', getU16Codec()],
]);

export function createUpdateLiquidationThresholdInstruction(
    accounts: UpdateLiquidationThresholdInstructionAccounts,
    args: UpdateLiquidationThresholdInstructionArgs,
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
    const instructionData = Buffer.from(UpdateLiquidationThresholdInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('35b957f38a0b4f1c', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
