import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getPermissionsEncoder, type PermissionsArgs } from '../types/permissions';
import { getStructEncoder, type Encoder } from '@solana/codecs';

export interface SetPerpetualsConfigInstructionAccounts {
    admin: Address;
    perpetuals: Address;
}

export interface SetPerpetualsConfigInstructionArgs {
    permissions: PermissionsArgs;
}

function getSetPerpetualsConfigInstructionDataEncoder(): Encoder<SetPerpetualsConfigInstructionArgs> {
    return getStructEncoder([['permissions', getPermissionsEncoder()]]);
}

export function createSetPerpetualsConfigInstruction(
    accounts: SetPerpetualsConfigInstructionAccounts,
    args: SetPerpetualsConfigInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSetPerpetualsConfigInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('504815bf1d792d6f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
