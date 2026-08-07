import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';

export const REPAY_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([208, 50, 208, 39, 189, 153, 25, 251]);

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
    lenderPrincipalEscrow: Address;
    borrowerCollateralEscrow: Address;
    protocolFeeTokenAccount: Address;
    principalTokenProgram: Address;
    collateralTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedRepayTokenLoanInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        lender: AccountMeta;
        lenderUser: AccountMeta;
        loan: AccountMeta;
        loanVault: AccountMeta;
        config: AccountMeta;
        principalMint: AccountMeta;
        collateralMint: AccountMeta;
        signerPrincipalTokenAccount: AccountMeta;
        lenderPrincipalEscrow: AccountMeta;
        borrowerCollateralEscrow: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        principalTokenProgram: AccountMeta;
        collateralTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseRepayTokenLoanInstruction(instruction: TransactionInstruction): ParsedRepayTokenLoanInstruction {
    if (instruction.keys.length < 17) {
        throw new Error('Expected 17 account metas for RepayTokenLoan instruction');
    }
    if (!REPAY_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('RepayTokenLoan instruction discriminator mismatch');
    }
    const instructionData = instruction.data.subarray(8);
    return {
        programId: instruction.programId,
        accounts: {
            signer: instruction.keys[0]!,
            signerUser: instruction.keys[1]!,
            lender: instruction.keys[2]!,
            lenderUser: instruction.keys[3]!,
            loan: instruction.keys[4]!,
            loanVault: instruction.keys[5]!,
            config: instruction.keys[6]!,
            principalMint: instruction.keys[7]!,
            collateralMint: instruction.keys[8]!,
            signerPrincipalTokenAccount: instruction.keys[9]!,
            lenderPrincipalEscrow: instruction.keys[10]!,
            borrowerCollateralEscrow: instruction.keys[11]!,
            protocolFeeTokenAccount: instruction.keys[12]!,
            principalTokenProgram: instruction.keys[13]!,
            collateralTokenProgram: instruction.keys[14]!,
            eventAuthority: instruction.keys[15]!,
            program: instruction.keys[16]!,
        },
        data: {},
    };
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
        { pubkey: accounts.lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.borrowerCollateralEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.collateralTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REPAY_TOKEN_LOAN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
