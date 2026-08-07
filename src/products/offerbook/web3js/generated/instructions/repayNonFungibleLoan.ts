import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLoanVaultPda } from '../pdas/loanVault';

export const REPAY_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([148, 211, 15, 57, 173, 27, 26, 49]);

export interface RepayNonFungibleLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
    loan: Address;
    loanVault?: Address;
    config: Address;
    principalMint: Address;
    signerPrincipalTokenAccount: Address;
    lenderPrincipalEscrow: Address;
    protocolFeeTokenAccount: Address;
    principalTokenProgram: Address;
    systemProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedRepayNonFungibleLoanInstruction {
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
        signerPrincipalTokenAccount: AccountMeta;
        lenderPrincipalEscrow: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        principalTokenProgram: AccountMeta;
        systemProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseRepayNonFungibleLoanInstruction(
    instruction: TransactionInstruction,
): ParsedRepayNonFungibleLoanInstruction {
    if (instruction.keys.length < 15) {
        throw new Error('Expected 15 account metas for RepayNonFungibleLoan instruction');
    }
    if (
        !REPAY_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)
    ) {
        throw new Error('RepayNonFungibleLoan instruction discriminator mismatch');
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
            signerPrincipalTokenAccount: instruction.keys[8]!,
            lenderPrincipalEscrow: instruction.keys[9]!,
            protocolFeeTokenAccount: instruction.keys[10]!,
            principalTokenProgram: instruction.keys[11]!,
            systemProgram: instruction.keys[12]!,
            eventAuthority: instruction.keys[13]!,
            program: instruction.keys[14]!,
        },
        data: {},
    };
}

export async function createRepayNonFungibleLoanInstruction(
    accounts: RepayNonFungibleLoanInstructionAccounts,
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
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: loanVault, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        { pubkey: accounts.signerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: accounts.protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(REPAY_NON_FUNGIBLE_LOAN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
