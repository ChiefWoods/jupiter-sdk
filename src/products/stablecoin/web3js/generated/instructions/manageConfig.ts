import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { getConfigManagementActionEncoder, type ConfigManagementActionArgs } from '../types/configManagementAction';
import { getStructEncoder, type Encoder } from '@solana/codecs';

export interface ManageConfigInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    config: Address;
}

export interface ManageConfigInstructionArgs {
    action: ConfigManagementActionArgs;
}

function getManageConfigInstructionDataEncoder(): Encoder<ManageConfigInstructionArgs> {
    return getStructEncoder([['action', getConfigManagementActionEncoder()]]);
}

export function createManageConfigInstruction(
    accounts: ManageConfigInstructionAccounts,
    args: ManageConfigInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getManageConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('7733903718f2e8e7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
