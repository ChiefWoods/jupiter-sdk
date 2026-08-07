import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';

export const CLAIM_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([0, 112, 210, 85, 238, 81, 159, 29]);

export interface ClaimTokenLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    borrower: Address;
    borrowerUser: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    collateralMint: Address;
    lenderCollateralEscrow: Address;
    protocolFeeTokenAccount: Address;
    collateralTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedClaimTokenLoanInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        borrower: AccountMeta;
        borrowerUser: AccountMeta;
        loan: AccountMeta;
        loanVault: AccountMeta;
        config: AccountMeta;
        collateralMint: AccountMeta;
        lenderCollateralEscrow: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        collateralTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseClaimTokenLoanInstruction(instruction: TransactionInstruction): ParsedClaimTokenLoanInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for ClaimTokenLoan instruction');
    }
    if (!CLAIM_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ClaimTokenLoan instruction discriminator mismatch');
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
            collateralMint: instruction.keys[7]!,
            lenderCollateralEscrow: instruction.keys[8]!,
            protocolFeeTokenAccount: instruction.keys[9]!,
            collateralTokenProgram: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: {},
    };
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
        { pubkey: accounts.lenderCollateralEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(CLAIM_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
