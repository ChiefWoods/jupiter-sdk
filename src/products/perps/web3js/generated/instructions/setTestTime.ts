import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { PERPETUALS_PROGRAM_ID } from '..';
import { getI64Encoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface SetTestTimeInstructionAccounts {
    admin: Address;
    perpetuals: Address;
}

export interface SetTestTimeInstructionArgs {
    time: number | bigint;
}

function getSetTestTimeInstructionDataEncoder(): Encoder<SetTestTimeInstructionArgs> {
    return getStructEncoder([['time', getI64Encoder()]]);
}

export function createSetTestTimeInstruction(
    accounts: SetTestTimeInstructionAccounts,
    args: SetTestTimeInstructionArgs,
    programId: Address = PERPETUALS_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.admin, isSigner: true, isWritable: false },
        { pubkey: accounts.perpetuals, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getSetTestTimeInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('f2e7b1fb7e919f68', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
