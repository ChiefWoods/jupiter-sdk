import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface UpdateMaxSupplySharesInstructionAccounts {
    authority: Address;
    dexAdmin: Address;
    dex: Address;
}

export interface UpdateMaxSupplySharesInstructionArgs {
    maxSupplyShares: number | bigint;
}

function getUpdateMaxSupplySharesInstructionDataEncoder(): Encoder<UpdateMaxSupplySharesInstructionArgs> {
    return getStructEncoder([['maxSupplyShares', getU64Encoder()]]);
}

export function createUpdateMaxSupplySharesInstruction(
    accounts: UpdateMaxSupplySharesInstructionAccounts,
    args: UpdateMaxSupplySharesInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): TransactionInstruction {
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: false },
        { pubkey: accounts.dexAdmin, isSigner: false, isWritable: false },
        { pubkey: accounts.dex, isSigner: false, isWritable: true },
    ];
    const instructionData = Buffer.from(getUpdateMaxSupplySharesInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b39d25ceb033254f', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
