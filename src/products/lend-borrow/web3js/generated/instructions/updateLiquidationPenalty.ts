import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface UpdateLiquidationPenaltyInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultState: Address;
    vaultConfig: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
}

export interface UpdateLiquidationPenaltyInstructionArgs {
    vaultId: number;
    liquidationPenalty: number;
}

function getUpdateLiquidationPenaltyInstructionDataEncoder(): Encoder<UpdateLiquidationPenaltyInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['liquidationPenalty', getU16Encoder()],
    ]);
}

export function createUpdateLiquidationPenaltyInstruction(
    accounts: UpdateLiquidationPenaltyInstructionAccounts,
    args: UpdateLiquidationPenaltyInstructionArgs,
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
    const instructionData = Buffer.from(getUpdateLiquidationPenaltyInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('15a8a7ce62ce4520', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
