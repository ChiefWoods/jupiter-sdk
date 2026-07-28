import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { findLendingAdminPda } from '../pdas/lendingAdmin';
import { fixEncoderSize, getBytesEncoder, getStructEncoder, transformEncoder, type Encoder } from '@solana/codecs';

export interface InitLendingAdminInstructionAccounts {
    authority: Address;
    lendingAdmin?: Address;
    systemProgram: Address;
}

export interface InitLendingAdminInstructionArgs {
    liquidityProgram: Address;
    rebalancer: Address;
    authority: Address;
}

function getInitLendingAdminInstructionDataEncoder(): Encoder<InitLendingAdminInstructionArgs> {
    return getStructEncoder([
        [
            'liquidityProgram',
            transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes()),
        ],
        ['rebalancer', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
        ['authority', transformEncoder(fixEncoderSize(getBytesEncoder(), 32), (value: Address) => value.toBytes())],
    ]);
}

export async function createInitLendingAdminInstruction(
    accounts: InitLendingAdminInstructionAccounts,
    args: InitLendingAdminInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lendingAdmin = accounts.lendingAdmin;
    if (!lendingAdmin) {
        const [derived] = await findLendingAdminPda(programId);
        lendingAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.authority, isSigner: true, isWritable: true },
        { pubkey: lendingAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitLendingAdminInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('cbb9f1a538fe2109', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
