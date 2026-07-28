import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';
import { getLoanTypeEncoder, type LoanTypeArgs } from '../types/loanType';
import { getStructEncoder, getU32Encoder, getU64Encoder, type Encoder } from '@solana/codecs';

export interface FillTokenPrincipalOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
    offer: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    principalMint: Address;
    collateralMint: Address;
    lenderPrincipalEscrow: Address;
    borrowerCollateralEscrow: Address;
    borrowerPrincipalTokenAccount: Address;
    protocolFeeTokenAccount: Address;
    principalTokenProgram: Address;
    collateralTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface FillTokenPrincipalOfferInstructionArgs {
    principalFillAmount: number | bigint;
    maxCollateral: number | bigint;
    duration: number;
    apy: number;
    loanType: LoanTypeArgs;
}

function getFillTokenPrincipalOfferInstructionDataEncoder(): Encoder<FillTokenPrincipalOfferInstructionArgs> {
    return getStructEncoder([
        ['principalFillAmount', getU64Encoder()],
        ['maxCollateral', getU64Encoder()],
        ['duration', getU32Encoder()],
        ['apy', getU32Encoder()],
        ['loanType', getLoanTypeEncoder()],
    ]);
}

export async function createFillTokenPrincipalOfferInstruction(
    accounts: FillTokenPrincipalOfferInstructionAccounts,
    args: FillTokenPrincipalOfferInstructionArgs,
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
        { pubkey: accounts.offer, isSigner: false, isWritable: true },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralMint, isSigner: false, isWritable: false },
        { pubkey: accounts.lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerCollateralEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getFillTokenPrincipalOfferInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('53d7b0a1b06981b1', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
