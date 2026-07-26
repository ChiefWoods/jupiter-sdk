import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDINGREWARDRATEMODEL_PROGRAM_ID } from '..';
import { findLendingRewardsAdminPda } from '../pdas/lendingRewardsAdmin';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitLendingRewardsAdminInstructionAccounts {
    signer: Address;
    lendingRewardsAdmin?: Address;
    systemProgram: Address;
}

export interface InitLendingRewardsAdminInstructionArgs {
    authority: Address;
    lendingProgram: Address;
}

const InitLendingRewardsAdminInstructionDataCodec = getStructCodec([
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
    [
        'lendingProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export async function createInitLendingRewardsAdminInstruction(
    accounts: InitLendingRewardsAdminInstructionAccounts,
    args: InitLendingRewardsAdminInstructionArgs,
    programId: Address = LENDINGREWARDRATEMODEL_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lendingRewardsAdmin = accounts.lendingRewardsAdmin;
    if (!lendingRewardsAdmin) {
        const [derived] = await findLendingRewardsAdminPda(programId);
        lendingRewardsAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: lendingRewardsAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitLendingRewardsAdminInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('ca242fd103c9ad5e', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
