import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { findVaultAdminPda } from '../pdas/vaultAdmin';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitVaultAdminInstructionAccounts {
    signer: Address;
    vaultAdmin?: Address;
    systemProgram: Address;
}

export interface InitVaultAdminInstructionArgs {
    liquidity: Address;
    authority: Address;
}

const InitVaultAdminInstructionDataCodec = getStructCodec([
    [
        'liquidity',
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

export async function createInitVaultAdminInstruction(
    accounts: InitVaultAdminInstructionAccounts,
    args: InitVaultAdminInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let vaultAdmin = accounts.vaultAdmin;
    if (!vaultAdmin) {
        const [derived] = await findVaultAdminPda(programId);
        vaultAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: vaultAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitVaultAdminInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('168502f47b64f9e6', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
