import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';
import {
    getStructDecoder,
    getStructEncoder,
    getU32Decoder,
    getU32Encoder,
    type Decoder,
    type Encoder,
} from '@solana/codecs';

export const FILL_NON_FUNGIBLE_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    99, 127, 177, 155, 175, 160, 24, 234,
]);

export interface FillNonFungiblePrincipalOfferInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
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

export interface FillNonFungiblePrincipalOfferInstructionArgs {
    duration: number;
    apy: number;
}

function getFillNonFungiblePrincipalOfferInstructionDataEncoder(): Encoder<FillNonFungiblePrincipalOfferInstructionArgs> {
    return getStructEncoder([
        ['duration', getU32Encoder()],
        ['apy', getU32Encoder()],
    ]);
}

function getFillNonFungiblePrincipalOfferInstructionDataDecoder(): Decoder<FillNonFungiblePrincipalOfferInstructionArgs> {
    return getStructDecoder([
        ['duration', getU32Decoder()],
        ['apy', getU32Decoder()],
    ]);
}

export interface ParsedFillNonFungiblePrincipalOfferInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        lender: AccountMeta;
        lenderUser: AccountMeta;
        offer: AccountMeta;
        loan: AccountMeta;
        loanVault: AccountMeta;
        config: AccountMeta;
        principalMint: AccountMeta;
        collateralMint: AccountMeta;
        lenderPrincipalEscrow: AccountMeta;
        borrowerPrincipalTokenAccount: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        principalTokenProgram: AccountMeta;
        collateralTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: FillNonFungiblePrincipalOfferInstructionArgs;
}

export function parseFillNonFungiblePrincipalOfferInstruction(
    instruction: TransactionInstruction,
): ParsedFillNonFungiblePrincipalOfferInstruction {
    if (instruction.keys.length < 18) {
        throw new Error('Expected 18 account metas for FillNonFungiblePrincipalOffer instruction');
    }
    if (
        !FILL_NON_FUNGIBLE_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR.every(
            (byte, index) => instruction.data[0 + index] === byte,
        )
    ) {
        throw new Error('FillNonFungiblePrincipalOffer instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            lender: instruction.keys[2]!,
            lenderUser: instruction.keys[3]!,
            offer: instruction.keys[4]!,
            loan: instruction.keys[5]!,
            loanVault: instruction.keys[6]!,
            config: instruction.keys[7]!,
            principalMint: instruction.keys[8]!,
            collateralMint: instruction.keys[9]!,
            lenderPrincipalEscrow: instruction.keys[10]!,
            borrowerPrincipalTokenAccount: instruction.keys[11]!,
            protocolFeeTokenAccount: instruction.keys[12]!,
            principalTokenProgram: instruction.keys[13]!,
            collateralTokenProgram: instruction.keys[14]!,
            systemProgram: instruction.keys[15]!,
            eventAuthority: instruction.keys[16]!,
            program: instruction.keys[17]!,
        },
        data: getFillNonFungiblePrincipalOfferInstructionDataDecoder().decode(instructionData),
    };
}

export async function createFillNonFungiblePrincipalOfferInstruction(
    accounts: FillNonFungiblePrincipalOfferInstructionAccounts,
    args: FillNonFungiblePrincipalOfferInstructionArgs,
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
    let data = Buffer.from(getFillNonFungiblePrincipalOfferInstructionDataEncoder().encode(args));
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(FILL_NON_FUNGIBLE_PRINCIPAL_OFFER_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
