import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface RedeemInstructionAccounts {
    user: Address;
    userLpTokenAccount: Address;
    userCollateralTokenAccount: Address;
    config: Address;
    authority: Address;
    lpMint: Address;
    vault: Address;
    vaultTokenAccount: Address;
    vaultMint: Address;
    benefactor: Address;
    lpTokenProgram: Address;
    vaultTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface RedeemInstructionArgs {
    amount: number | bigint;
    minAmountOut: number | bigint;
}

function getRedeemInstructionDataEncoder(): Encoder<RedeemInstructionArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

export async function createRedeemInstruction(
    accounts: RedeemInstructionAccounts,
    args: RedeemInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.userLpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userCollateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: accounts.lpMint, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getRedeemInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('b80c569546c461e1', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
