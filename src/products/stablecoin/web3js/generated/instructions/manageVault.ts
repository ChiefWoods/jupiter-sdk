import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { getStructEncoder, type Encoder } from '@solana/codecs';
import { getVaultManagementActionEncoder, type VaultManagementActionArgs } from '../types/vaultManagementAction';

export interface ManageVaultInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    vault: Address;
}

export interface ManageVaultInstructionArgs {
    action: VaultManagementActionArgs;
}

function getManageVaultInstructionDataEncoder(): Encoder<ManageVaultInstructionArgs> {
    return getStructEncoder([['action', getVaultManagementActionEncoder()]]);
}

export function createManageVaultInstruction(
    accounts: ManageVaultInstructionAccounts,
    args: ManageVaultInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getManageVaultInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a5076af249c1c380', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
