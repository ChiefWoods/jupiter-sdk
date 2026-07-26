import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { UpdateConfigAction, updateConfigActionCodec } from '../types/updateConfigAction';
import { getStructCodec } from '@solana/codecs';

export interface UpdateConfigInstructionAccounts {
    admin: Address;
    config: Address;
}

export interface UpdateConfigInstructionArgs {
    action: UpdateConfigAction;
}

const UpdateConfigInstructionDataCodec = getStructCodec([['action', updateConfigActionCodec]]);

export function createUpdateConfigInstruction(
    accounts: UpdateConfigInstructionAccounts,
    args: UpdateConfigInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('1d9efcbf0a53db63', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
