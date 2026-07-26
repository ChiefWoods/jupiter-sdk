import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { BenefactorManagementAction, benefactorManagementActionCodec } from '../types/benefactorManagementAction';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { getStructCodec } from '@solana/codecs';

export interface ManageBenefactorInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    benefactor: Address;
}

export interface ManageBenefactorInstructionArgs {
    action: BenefactorManagementAction;
}

const ManageBenefactorInstructionDataCodec = getStructCodec([['action', benefactorManagementActionCodec]]);

export function createManageBenefactorInstruction(
    accounts: ManageBenefactorInstructionAccounts,
    args: ManageBenefactorInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(ManageBenefactorInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('16e7803e73db950e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
