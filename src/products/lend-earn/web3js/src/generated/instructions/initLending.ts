import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { LENDING_PROGRAM_ID } from '..';
import {
    addCodecSizePrefix,
    fixCodecSize,
    getBytesCodec,
    getStructCodec,
    getU32Codec,
    getUtf8Codec,
    transformCodec,
} from '@solana/codecs';
import { findFTokenMintPda } from '../pdas/fTokenMint';
import { findLendingPda } from '../pdas/lending';
import { findMetadataAccountPda } from '../pdas/metadataAccount';

export interface InitLendingInstructionAccounts {
    signer: Address;
    lendingAdmin: Address;
    mint: Address;
    fTokenMint?: Address;
    metadataAccount?: Address;
    lending?: Address;
    tokenReservesLiquidity: Address;
    tokenProgram: Address;
    systemProgram: Address;
    sysvarInstruction: Address;
    metadataProgram: Address;
    rent: Address;
}

export interface InitLendingInstructionArgs {
    symbol: string;
    liquidityProgram: Address;
}

const InitLendingInstructionDataCodec = getStructCodec([
    ['symbol', addCodecSizePrefix(getUtf8Codec(), getU32Codec())],
    [
        'liquidityProgram',
        transformCodec(
            fixCodecSize(getBytesCodec(), 32),
            (value: Address) => value.toBytes(),
            value => new Address(value),
        ),
    ],
]);

export async function createInitLendingInstruction(
    accounts: InitLendingInstructionAccounts,
    args: InitLendingInstructionArgs,
    programId: Address = LENDING_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let fTokenMint = accounts.fTokenMint;
    if (!fTokenMint) {
        const [derived] = await findFTokenMintPda(
            {
                mint: accounts.mint,
            },
            programId,
        );
        fTokenMint = derived;
    }
    let metadataAccount = accounts.metadataAccount;
    if (!metadataAccount) {
        const [derived] = await findMetadataAccountPda(
            {
                fTokenMint: accounts.fTokenMint,
            },
            programId,
        );
        metadataAccount = derived;
    }
    let lending = accounts.lending;
    if (!lending) {
        const [derived] = await findLendingPda(
            {
                mint: accounts.mint,
                fTokenMint: accounts.fTokenMint,
            },
            programId,
        );
        lending = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.lendingAdmin, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: fTokenMint, isSigner: false, isWritable: true },
        { pubkey: metadataAccount, isSigner: false, isWritable: true },
        { pubkey: lending, isSigner: false, isWritable: true },
        { pubkey: accounts.tokenReservesLiquidity, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.sysvarInstruction, isSigner: false, isWritable: false },
        { pubkey: accounts.metadataProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(InitLendingInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('9ce0432e59bd9dd1', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
