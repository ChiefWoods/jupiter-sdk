import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { findVaultStatePda } from '../pdas/vaultState';
import { getStructEncoder, getU16Encoder, type Encoder } from '@solana/codecs';

export interface InitVaultStateInstructionAccounts {
    authority: Address;
    vaultAdmin: Address;
    vaultConfig: Address;
    vaultState?: Address;
    supplyTokenReservesLiquidity: Address;
    borrowTokenReservesLiquidity: Address;
    systemProgram: Address;
}

export interface InitVaultStateInstructionArgs {
    vaultId: number;
}

function getInitVaultStateInstructionDataEncoder(): Encoder<InitVaultStateInstructionArgs> {
    return getStructEncoder([['vaultId', getU16Encoder()]]);
}

export async function createInitVaultStateInstruction(
    accounts: InitVaultStateInstructionAccounts,
    args: InitVaultStateInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vaultState = accounts.vaultState;
    if (!vaultState) {
        const [derived] = await findVaultStatePda(
            {
                vaultId: args.vaultId,
            },
            programId,
        );
        vaultState = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: vaultState, isSigner: false, isWritable: true },
        { pubkey: accounts.supplyTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.borrowTokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitVaultStateInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('60781764990b0da5', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
