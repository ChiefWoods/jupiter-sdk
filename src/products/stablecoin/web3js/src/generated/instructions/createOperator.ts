import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { OperatorRole, operatorRoleCodec } from '../types/operatorRole';
import { findNewOperatorPda } from '../pdas/newOperator';
import { getStructCodec } from '@solana/codecs';

export interface CreateOperatorInstructionAccounts {
    operatorAuthority: Address;
    payer: Address;
    operator: Address;
    newOperatorAuthority: Address;
    newOperator?: Address;
    systemProgram: Address;
}

export interface CreateOperatorInstructionArgs {
    role: OperatorRole;
}

const CreateOperatorInstructionDataCodec = getStructCodec([['role', operatorRoleCodec]]);

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
    const instructionData = Buffer.from(CreateOperatorInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('9128ee4bb5fc3b0b', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
