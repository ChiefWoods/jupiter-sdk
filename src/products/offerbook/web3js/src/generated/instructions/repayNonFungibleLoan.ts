import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLenderPrincipalEscrowPda } from '../pdas/lenderPrincipalEscrow';
import { findLoanVaultPda } from '../pdas/loanVault';

export interface RepayNonFungibleLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    principalMint: Address;
    signerPrincipalTokenAccount: Address;
    lenderPrincipalEscrow?: Address;
    protocolFeeTokenAccount: Address;
    principalTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export async function createRepayNonFungibleLoanInstruction(
    accounts: RepayNonFungibleLoanInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let loanVault = accounts.loanVault;
    if (!loanVault) {
        const [derived] = await findLoanVaultPda(
            {
                loan: accounts.loan,
            },
            programId,
        );
        loanVault = derived;
    }
    let lenderPrincipalEscrow = accounts.lenderPrincipalEscrow;
    if (!lenderPrincipalEscrow) {
        const [derived] = await findLenderPrincipalEscrowPda(
            {
                lenderUser: accounts.lenderUser,
                principalTokenProgram: accounts.principalTokenProgram,
                principalMint: accounts.principalMint,
            },
            programId,
        );
        lenderPrincipalEscrow = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.lender, isSigner: false, isWritable: true },
        { pubkey: accounts.lenderUser, isSigner: false, isWritable: true },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        { pubkey: accounts.signerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('94d30f39ad1b1a31', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
