import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getBooleanEncoder, getStructEncoder, type Encoder } from '@solana/codecs';

export interface UnpauseUserInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UnpauseUserInstructionArgs {
    unpauseSupply: boolean;
    unpauseBorrow: boolean;
}

function getUnpauseUserInstructionDataEncoder(): Encoder<UnpauseUserInstructionArgs> {
    return getStructEncoder([
        ['unpauseSupply', getBooleanEncoder()],
        ['unpauseBorrow', getBooleanEncoder()],
    ]);
}

export function createUnpauseUserInstruction(
    accounts: UnpauseUserInstructionAccounts,
    args: UnpauseUserInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUnpauseUserInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('477380fcb67eea3e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
