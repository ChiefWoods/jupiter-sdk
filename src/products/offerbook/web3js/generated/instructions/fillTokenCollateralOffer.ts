import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';
import { getLoanTypeDecoder, getLoanTypeEncoder, type LoanTypeArgs } from '../types/loanType';
import {
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    getU64Decoder,
    getU64Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const FILL_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    170, 251, 0, 181, 163, 83, 106, 228,
]);

export interface FillTokenCollateralOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    borrower: Address;
    borrowerUser: Address;
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

export interface FillTokenCollateralOfferInstructionArgs {
    collateralFillAmount: number | bigint;
    maxPrincipal: number | bigint;
    duration: number;
    apy: number;
    loanType: LoanTypeArgs;
}

function getFillTokenCollateralOfferInstructionDataEncoder(): Encoder<FillTokenCollateralOfferInstructionArgs> {
    return getStructEncoder([
        ['collateralFillAmount', getU64Encoder()],
        ['maxPrincipal', getU64Encoder()],
        ['duration', getU32Encoder()],
        ['apy', getU32Encoder()],
        ['loanType', getLoanTypeEncoder()],
    ]);
}

function getFillTokenCollateralOfferInstructionDataDecoder(): Decoder<FillTokenCollateralOfferInstructionArgs> {
    return getStructDecoder([
        ['collateralFillAmount', getU64Decoder()],
        ['maxPrincipal', getU64Decoder()],
        ['duration', getU32Decoder()],
        ['apy', getU32Decoder()],
        ['loanType', getLoanTypeDecoder()],
    ]);
}

export interface ParsedFillTokenCollateralOfferInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        borrower: AccountMeta;
        borrowerUser: AccountMeta;
        offer: AccountMeta;
        loan: AccountMeta;
        loanVault: AccountMeta;
        config: AccountMeta;
        principalMint: AccountMeta;
        collateralMint: AccountMeta;
        lenderPrincipalEscrow: AccountMeta;
        borrowerCollateralEscrow: AccountMeta;
        borrowerPrincipalTokenAccount: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        principalTokenProgram: AccountMeta;
        collateralTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: FillTokenCollateralOfferInstructionArgs;
}

export function parseFillTokenCollateralOfferInstruction(
    instruction: TransactionInstruction,
): ParsedFillTokenCollateralOfferInstruction {
    if (instruction.keys.length < 19) {
        throw new Error('Expected 19 account metas for FillTokenCollateralOffer instruction');
    }
    if (
        !FILL_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('FillTokenCollateralOffer instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            borrower: instruction.keys[2]!,
            borrowerUser: instruction.keys[3]!,
            offer: instruction.keys[4]!,
            loan: instruction.keys[5]!,
            loanVault: instruction.keys[6]!,
            config: instruction.keys[7]!,
            principalMint: instruction.keys[8]!,
            collateralMint: instruction.keys[9]!,
            lenderPrincipalEscrow: instruction.keys[10]!,
            borrowerCollateralEscrow: instruction.keys[11]!,
            borrowerPrincipalTokenAccount: instruction.keys[12]!,
            protocolFeeTokenAccount: instruction.keys[13]!,
            principalTokenProgram: instruction.keys[14]!,
            collateralTokenProgram: instruction.keys[15]!,
            systemProgram: instruction.keys[16]!,
            eventAuthority: instruction.keys[17]!,
            program: instruction.keys[18]!,
        },
        data: getFillTokenCollateralOfferInstructionDataDecoder().decode(instructionData),
    };
}

export async function createFillTokenCollateralOfferInstruction(
    accounts: FillTokenCollateralOfferInstructionAccounts,
    args: FillTokenCollateralOfferInstructionArgs,
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
    let data = Buffer.from(getFillTokenCollateralOfferInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(FILL_TOKEN_COLLATERAL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
