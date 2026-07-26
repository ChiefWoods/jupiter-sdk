import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { OperatorManagementAction, operatorManagementActionCodec } from '../types/operatorManagementAction';
import { getStructCodec } from '@solana/codecs';

export interface ManageOperatorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    managedOperator: Address;
    systemProgram: Address;
}

export interface ManageOperatorInstructionArgs {
    action: OperatorManagementAction;
}

const ManageOperatorInstructionDataCodec = getStructCodec([['action', operatorManagementActionCodec]]);

export function createManageOperatorInstruction(
    accounts: ManageOperatorInstructionAccounts,
    args: ManageOperatorInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.managedOperator, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(ManageOperatorInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('52ac6aeb93f66055', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
