import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructCodec, getU16Codec, getU64Codec } from '@solana/codecs';

export interface UpdateUserSupplyConfigInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
    position: Address;
}

export interface UpdateUserSupplyConfigInstructionArgs {
    expandPercent: number;
    expandDuration: bigint;
    baseWithdrawalLimit: bigint;
}

const UpdateUserSupplyConfigInstructionDataCodec = getStructCodec([
    ['expandPercent', getU16Codec()],
    ['expandDuration', getU64Codec()],
    ['baseWithdrawalLimit', getU64Codec()],
]);

export function createUpdateUserSupplyConfigInstruction(
    accounts: UpdateUserSupplyConfigInstructionAccounts,
    args: UpdateUserSupplyConfigInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: false },
        { pubkey: accounts.position, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(UpdateUserSupplyConfigInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('d9efe1da2131eab7', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
