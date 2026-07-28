import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { findNewOperatorPda } from '../pdas/newOperator';
import { getOperatorRoleEncoder, type OperatorRoleArgs } from '../types/operatorRole';
import { getStructEncoder, type Encoder } from '@solana/codecs';

export interface CreateOperatorInstructionAccounts {
    operatorAuthority: Address;
    payer: Address;
    operator: Address;
    newOperatorAuthority: Address;
    newOperator?: Address;
    systemProgram: Address;
}

export interface CreateOperatorInstructionArgs {
    role: OperatorRoleArgs;
}

function getCreateOperatorInstructionDataEncoder(): Encoder<CreateOperatorInstructionArgs> {
    return getStructEncoder([['role', getOperatorRoleEncoder()]]);
}

export async function createCreateOperatorInstruction(
    accounts: CreateOperatorInstructionAccounts,
    args: CreateOperatorInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let newOperator = accounts.newOperator;
    if (!newOperator) {
        const [derived] = await findNewOperatorPda(
            {
                newOperatorAuthority: accounts.newOperatorAuthority,
            },
            programId,
        );
        newOperator = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.newOperatorAuthority, isSigner: false, isWritable: false },
        { pubkey: newOperator, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getCreateOperatorInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('9128ee4bb5fc3b0b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
