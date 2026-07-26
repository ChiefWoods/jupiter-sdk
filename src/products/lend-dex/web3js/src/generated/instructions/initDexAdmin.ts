import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { DEX_PROGRAM_ID } from '..';
import { findDexAdminPda } from '../pdas/dexAdmin';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitDexAdminInstructionAccounts {
    signer: Address;
    dexAdmin?: Address;
    systemProgram: Address;
}

export interface InitDexAdminInstructionArgs {
    liquidity: Address;
    authority: Address;
}

const InitDexAdminInstructionDataCodec = getStructCodec([
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

export async function createInitDexAdminInstruction(
    accounts: InitDexAdminInstructionAccounts,
    args: InitDexAdminInstructionArgs,
    programId: Address = DEX_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let dexAdmin = accounts.dexAdmin;
    if (!dexAdmin) {
        const [derived] = await findDexAdminPda(programId);
        dexAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: dexAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitDexAdminInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('103d623dbdf334fc', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
