import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';

export const CLAIM_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([
    152, 212, 201, 200, 206, 13, 149, 210,
]);

export interface ClaimNonFungibleLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    borrower: Address;
    borrowerUser: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedClaimNonFungibleLoanInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        borrower: AccountMeta;
        borrowerUser: AccountMeta;
        loan: AccountMeta;
        loanVault: AccountMeta;
        config: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseClaimNonFungibleLoanInstruction(
    instruction: TransactionInstruction,
): ParsedClaimNonFungibleLoanInstruction {
    if (instruction.keys.length < 10) {
        throw new Error('Expected 10 account metas for ClaimNonFungibleLoan instruction');
    }
    if (
        !CLAIM_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('ClaimNonFungibleLoan instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            borrower: instruction.keys[2]!,
            borrowerUser: instruction.keys[3]!,
            loan: instruction.keys[4]!,
            loanVault: instruction.keys[5]!,
            config: instruction.keys[6]!,
            systemProgram: instruction.keys[7]!,
            eventAuthority: instruction.keys[8]!,
            program: instruction.keys[9]!,
        },
        data: {},
    };
}

export async function createClaimNonFungibleLoanInstruction(
    accounts: ClaimNonFungibleLoanInstructionAccounts,
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
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
