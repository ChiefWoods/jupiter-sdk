import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { VaultManagementAction, vaultManagementActionCodec } from '../types/vaultManagementAction';
import { getStructCodec } from '@solana/codecs';

export interface ManageVaultInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    vault: Address;
}

export interface ManageVaultInstructionArgs {
    action: VaultManagementAction;
}

const ManageVaultInstructionDataCodec = getStructCodec([['action', vaultManagementActionCodec]]);

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
    const instructionData = Buffer.from(ManageVaultInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('a5076af249c1c380', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
