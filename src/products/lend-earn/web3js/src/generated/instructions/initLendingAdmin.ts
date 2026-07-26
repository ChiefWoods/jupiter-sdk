import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import { findLendingAdminPda } from '../pdas/lendingAdmin';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

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

const InitLendingAdminInstructionDataCodec = getStructCodec([
    [
        'liquidityProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'rebalancer',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

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
    const instructionData = Buffer.from(InitLendingAdminInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('cbb9f1a538fe2109', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
