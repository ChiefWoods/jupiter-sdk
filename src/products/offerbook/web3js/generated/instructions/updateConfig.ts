import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { getStructEncoder, type Encoder } from '@solana/codecs';
import { getUpdateConfigActionEncoder, type UpdateConfigActionArgs } from '../types/updateConfigAction';

export interface UpdateConfigInstructionAccounts {
    admin: Address;
    config: Address;
}

export interface UpdateConfigInstructionArgs {
    action: UpdateConfigActionArgs;
}

function getUpdateConfigInstructionDataEncoder(): Encoder<UpdateConfigInstructionArgs> {
    return getStructEncoder([['action', getUpdateConfigActionEncoder()]]);
}

export function createUpdateConfigInstruction(
    accounts: UpdateConfigInstructionAccounts,
    args: UpdateConfigInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('1d9efcbf0a53db63', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
