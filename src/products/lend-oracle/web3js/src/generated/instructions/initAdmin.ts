import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { ORACLE_PROGRAM_ID } from '..';
import { findOracleAdminPda } from '../pdas/oracleAdmin';
import { fixCodecSize, getBytesCodec, getStructCodec, transformCodec } from '@solana/codecs';

export interface InitAdminInstructionAccounts {
    signer: Address;
    oracleAdmin?: Address;
    systemProgram: Address;
}

export interface InitAdminInstructionArgs {
    authority: Address;
}

const InitAdminInstructionDataCodec = getStructCodec([
    [
        'authority',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export async function createInitAdminInstruction(
    accounts: InitAdminInstructionAccounts,
    args: InitAdminInstructionArgs,
    programId: Address = ORACLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let oracleAdmin = accounts.oracleAdmin;
    if (!oracleAdmin) {
        const [derived] = await findOracleAdminPda(programId);
        oracleAdmin = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: oracleAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitAdminInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('6141611bc8ce48db', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
