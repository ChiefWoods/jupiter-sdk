import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LIQUIDITY_PROGRAM_ID } from '..';
import { getBooleanCodec, getStructCodec } from '@solana/codecs';

export interface ChangeStatusInstructionAccounts {
    authority: Address;
    liquidity: Address;
    authList: Address;
}

export interface ChangeStatusInstructionArgs {
    status: boolean;
}

const ChangeStatusInstructionDataCodec = getStructCodec([['status', getBooleanCodec()]]);

export function createChangeStatusInstruction(
    accounts: ChangeStatusInstructionAccounts,
    args: ChangeStatusInstructionArgs,
    programId: Address = LIQUIDITY_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.liquidity, isSigner: false, isWritable: true },
        { pubkey: accounts.authList, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(ChangeStatusInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('ec9183e4e311c0ff', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
