import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLenderPrincipalEscrowPda } from '../pdas/lenderPrincipalEscrow';
import { findLoanPda } from '../pdas/loan';
import { findLoanVaultPda } from '../pdas/loanVault';
import { findProtocolFeeTokenAccountPda } from '../pdas/protocolFeeTokenAccount';
import { getStructCodec, getU32Codec } from '@solana/codecs';

export interface FillNonFungiblePrincipalOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
    offer: Address;
    loan?: Address;
    loanVault?: Address;
    config: Address;
    principalMint: Address;
    collateralMint?: Address;
    lenderPrincipalEscrow?: Address;
    borrowerPrincipalTokenAccount: Address;
    protocolFeeTokenAccount?: Address;
    principalTokenProgram: Address;
    collateralTokenProgram?: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface FillNonFungiblePrincipalOfferInstructionArgs {
    duration: number;
    apy: number;
}

const FillNonFungiblePrincipalOfferInstructionDataCodec = getStructCodec([
    ['duration', getU32Codec()],
    ['apy', getU32Codec()],
]);

export async function createFillNonFungiblePrincipalOfferInstruction(
    accounts: FillNonFungiblePrincipalOfferInstructionAccounts,
    args: FillNonFungiblePrincipalOfferInstructionArgs,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let loan = accounts.loan;
    if (!loan) {
        const [derived] = await findLoanPda(
            {
                offer: accounts.offer,
                offer: accounts.offer,
            },
            programId,
        );
        loan = derived;
    }
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
        { pubkey: accounts.signerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.lender, isSigner: false, isWritable: true },
        { pubkey: accounts.lenderUser, isSigner: false, isWritable: true },
        { pubkey: accounts.offer, isSigner: false, isWritable: true },
        { pubkey: loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        accounts.collateralMint
            ? { pubkey: accounts.collateralMint, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        accounts.collateralTokenProgram
            ? { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(FillNonFungiblePrincipalOfferInstructionDataCodec.encode(args));
    const discriminator = Buffer.from('637fb19bafa018ea', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
