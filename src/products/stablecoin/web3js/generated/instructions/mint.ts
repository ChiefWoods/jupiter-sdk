import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { findCustodianTokenAccountPda } from '../pdas/custodianTokenAccount';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { getStructEncoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface MintInstructionAccounts {
    user: Address;
    userCollateralTokenAccount: Address;
    userLpTokenAccount: Address;
    config: Address;
    authority: Address;
    lpMint: Address;
    vault: Address;
    vaultMint: Address;
    custodian: Address;
    custodianTokenAccount?: Address;
    benefactor: Address;
    lpTokenProgram: Address;
    vaultTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface MintInstructionArgs {
    amount: number | bigint;
    minAmountOut: number | bigint;
}

function getMintInstructionDataEncoder(): Encoder<MintInstructionArgs> {
    return getStructEncoder([
        ['amount', getU64Encoder()],
        ['minAmountOut', getU64Encoder()],
    ]);
}

export async function createMintInstruction(
    accounts: MintInstructionAccounts,
    args: MintInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let custodianTokenAccount = accounts.custodianTokenAccount;
    if (!custodianTokenAccount) {
        const [derived] = await findCustodianTokenAccountPda(
            {
                custodian: accounts.custodian,
                vaultTokenProgram: accounts.vaultTokenProgram,
                vaultMint: accounts.vaultMint,
            },
            programId,
        );
        custodianTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.user, isSigner: true, isWritable: true },
        { pubkey: accounts.userCollateralTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.userLpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: true },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: accounts.lpMint, isSigner: false, isWritable: true },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
        { pubkey: accounts.custodian, isSigner: false, isWritable: false },
        { pubkey: custodianTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.benefactor, isSigner: false, isWritable: true },
        { pubkey: accounts.lpTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.vaultTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getMintInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('3339e12fb69289a6', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
