import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '..';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';
import { getStructEncoder, getU32Encoder, type Encoder } from '@solana/codecs';

export interface FillNonFungibleCollateralOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    borrower: Address;
    borrowerUser: Address;
    offer: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    principalMint: Address;
    collateralMint?: Address;
    lenderPrincipalEscrow: Address;
    borrowerPrincipalTokenAccount: Address;
    protocolFeeTokenAccount: Address;
    principalTokenProgram: Address;
    collateralTokenProgram?: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface FillNonFungibleCollateralOfferInstructionArgs {
    duration: number;
    apy: number;
}

function getFillNonFungibleCollateralOfferInstructionDataEncoder(): Encoder<FillNonFungibleCollateralOfferInstructionArgs> {
    return getStructEncoder([
        ['duration', getU32Encoder()],
        ['apy', getU32Encoder()],
    ]);
}

export async function createFillNonFungibleCollateralOfferInstruction(
    accounts: FillNonFungibleCollateralOfferInstructionAccounts,
    args: FillNonFungibleCollateralOfferInstructionArgs,
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
        { pubkey: accounts.borrower, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerUser, isSigner: false, isWritable: true },
        { pubkey: accounts.offer, isSigner: false, isWritable: true },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        accounts.collateralMint
            ? { pubkey: accounts.collateralMint, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        accounts.collateralTokenProgram
            ? { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false }
            : { pubkey: programId, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getFillNonFungibleCollateralOfferInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('87377b2b733d8f91', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
