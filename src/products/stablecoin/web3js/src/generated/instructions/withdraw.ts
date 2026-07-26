import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { JUPSTABLE_PROGRAM_ID } from '..';
import { findCustodianTokenAccountPda } from '../pdas/custodianTokenAccount';
import { getStructCodec, getU64Codec } from '@solana/codecs';

export interface WithdrawInstructionAccounts {
    operatorAuthority: Address;
    operator: Address;
    custodian: Address;
    custodianTokenAccount?: Address;
    config: Address;
    authority: Address;
    vault: Address;
    vaultTokenAccount: Address;
    vaultMint: Address;
    tokenProgram: Address;
}

export interface WithdrawInstructionArgs {
    amount: bigint;
}

const WithdrawInstructionDataCodec = getStructCodec([['amount', getU64Codec()]]);

export async function createWithdrawInstruction(
    accounts: WithdrawInstructionAccounts,
    args: WithdrawInstructionArgs,
    programId: Address = JUPSTABLE_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let custodianTokenAccount = accounts.custodianTokenAccount;
    if (!custodianTokenAccount) {
        const [derived] = await findCustodianTokenAccountPda(
            {
                custodian: accounts.custodian,
                vaultTokenProgram: accounts.tokenProgram,
                vaultMint: accounts.vaultMint,
            },
            programId,
        );
        custodianTokenAccount = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.operatorAuthority, isSigner: true, isWritable: false },
        { pubkey: accounts.operator, isSigner: false, isWritable: false },
        { pubkey: accounts.custodian, isSigner: false, isWritable: false },
        { pubkey: custodianTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.authority, isSigner: false, isWritable: false },
        { pubkey: accounts.vault, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.vaultMint, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(WithdrawInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('b712469c946da122', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
