import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findBorrowerCollateralEscrowPda } from '../pdas/borrowerCollateralEscrow';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLenderPrincipalEscrowPda } from '../pdas/lenderPrincipalEscrow';
import { findLoanVaultPda } from '../pdas/loanVault';
import { findProtocolFeeTokenAccountPda } from '../pdas/protocolFeeTokenAccount';

export interface RepayTokenLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    principalMint: Address;
    collateralMint: Address;
    signerPrincipalTokenAccount: Address;
    lenderPrincipalEscrow?: Address;
    borrowerCollateralEscrow?: Address;
    protocolFeeTokenAccount?: Address;
    principalTokenProgram: Address;
    collateralTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export async function createRepayTokenLoanInstruction(
    accounts: RepayTokenLoanInstructionAccounts,
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
    let borrowerCollateralEscrow = accounts.borrowerCollateralEscrow;
    if (!borrowerCollateralEscrow) {
        const [derived] = await findBorrowerCollateralEscrowPda(
            {
                signerUser: accounts.signerUser,
                collateralTokenProgram: accounts.collateralTokenProgram,
                collateralMint: accounts.collateralMint,
            },
            programId,
        );
        borrowerCollateralEscrow = derived;
    }
    let protocolFeeTokenAccount = accounts.protocolFeeTokenAccount;
    if (!protocolFeeTokenAccount) {
        const [derived] = await findProtocolFeeTokenAccountPda(
            {
                config: accounts.config,
                principalTokenProgram: accounts.principalTokenProgram,
                principalMint: accounts.principalMint,
            },
            programId,
        );
        protocolFeeTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.lender, isSigner: false, isWritable: true },
        { pubkey: accounts.lenderUser, isSigner: false, isWritable: false },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralMint, isSigner: false, isWritable: false },
        { pubkey: accounts.signerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: borrowerCollateralEscrow, isSigner: false, isWritable: true },
        { pubkey: protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('d032d027bd9919fb', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
