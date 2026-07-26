import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getBooleanCodec, getStructCodec } from '@solana/codecs';

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

const UnpauseUserInstructionDataCodec = getStructCodec([
    ['unpauseSupply', getBooleanCodec()],
    ['unpauseBorrow', getBooleanCodec()],
]);

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
    const instructionData = Buffer.from(UnpauseUserInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('477380fcb67eea3e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
