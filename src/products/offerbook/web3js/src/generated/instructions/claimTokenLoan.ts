import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLenderCollateralEscrowPda } from '../pdas/lenderCollateralEscrow';
import { findLoanVaultPda } from '../pdas/loanVault';
import { findProtocolFeeTokenAccountPda } from '../pdas/protocolFeeTokenAccount';

export interface ClaimTokenLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    borrower: Address;
    borrowerUser: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    collateralMint: Address;
    lenderCollateralEscrow?: Address;
    protocolFeeTokenAccount?: Address;
    collateralTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export async function createClaimTokenLoanInstruction(
    accounts: ClaimTokenLoanInstructionAccounts,
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
    let lenderCollateralEscrow = accounts.lenderCollateralEscrow;
    if (!lenderCollateralEscrow) {
        const [derived] = await findLenderCollateralEscrowPda(
            {
                signerUser: accounts.signerUser,
                collateralTokenProgram: accounts.collateralTokenProgram,
                collateralMint: accounts.collateralMint,
            },
            programId,
        );
        lenderCollateralEscrow = derived;
    }
    let protocolFeeTokenAccount = accounts.protocolFeeTokenAccount;
    if (!protocolFeeTokenAccount) {
        const [derived] = await findProtocolFeeTokenAccountPda(
            {
                config: accounts.config,
                collateralTokenProgram: accounts.collateralTokenProgram,
                collateralMint: accounts.collateralMint,
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
        { pubkey: accounts.signerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.borrower, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralMint, isSigner: false, isWritable: false },
        { pubkey: lenderCollateralEscrow, isSigner: false, isWritable: true },
        { pubkey: protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const data = Buffer.from('0070d255ee519f1d', 'hex');

    return new TransactionInstruction({ keys, programId, data });
}
