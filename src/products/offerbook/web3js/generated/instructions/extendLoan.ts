import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';
import { findEventAuthorityPda } from '../pdas/eventAuthority';
import { findLenderPrincipalEscrowPda } from '../pdas/lenderPrincipalEscrow';
import { findProtocolFeeTokenAccountPda } from '../pdas/protocolFeeTokenAccount';

export const EXTEND_LOAN_INSTRUCTION_DISCRIMINATOR = new Uint8Array([2, 208, 222, 190, 109, 148, 247, 117]);

export interface ExtendLoanInstructionAccounts {
    signer: Address;
    signerUser: Address;
    lender: Address;
    lenderUser: Address;
    loan: Address;
    config: Address;
    principalMint: Address;
    signerPrincipalTokenAccount: Address;
    lenderPrincipalEscrow?: Address;
    protocolFeeTokenAccount?: Address;
    principalTokenProgram: Address;
    eventAuthority?: Address;
    program: Address;
}

export interface ParsedExtendLoanInstruction {
    programId: Address;
    accounts: {
        signer: AccountMeta;
        signerUser: AccountMeta;
        lender: AccountMeta;
        lenderUser: AccountMeta;
        loan: AccountMeta;
        config: AccountMeta;
        principalMint: AccountMeta;
        signerPrincipalTokenAccount: AccountMeta;
        lenderPrincipalEscrow: AccountMeta;
        protocolFeeTokenAccount: AccountMeta;
        principalTokenProgram: AccountMeta;
        eventAuthority: AccountMeta;
        program: AccountMeta;
    };
    data: {};
}

export function parseExtendLoanInstruction(instruction: TransactionInstruction): ParsedExtendLoanInstruction {
    if (instruction.keys.length < 13) {
        throw new Error('Expected 13 account metas for ExtendLoan instruction');
    }
    if (!EXTEND_LOAN_INSTRUCTION_DISCRIMINATOR.every((byte, index) => instruction.data[0 + index] === byte)) {
        throw new Error('ExtendLoan instruction discriminator mismatch');
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
            config: instruction.keys[5]!,
            principalMint: instruction.keys[6]!,
            signerPrincipalTokenAccount: instruction.keys[7]!,
            lenderPrincipalEscrow: instruction.keys[8]!,
            protocolFeeTokenAccount: instruction.keys[9]!,
            principalTokenProgram: instruction.keys[10]!,
            eventAuthority: instruction.keys[11]!,
            program: instruction.keys[12]!,
        },
        data: {},
    };
}

export async function createExtendLoanInstruction(
    accounts: ExtendLoanInstructionAccounts,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let lenderPrincipalEscrow = accounts.lenderPrincipalEscrow;
    if (!lenderPrincipalEscrow) {
        const [derived] = await findLenderPrincipalEscrowPda({
            lenderUser: accounts.lenderUser,
            principalTokenProgram: accounts.principalTokenProgram,
            principalMint: accounts.principalMint,
        });
        lenderPrincipalEscrow = derived;
    }
    let protocolFeeTokenAccount = accounts.protocolFeeTokenAccount;
    if (!protocolFeeTokenAccount) {
        const [derived] = await findProtocolFeeTokenAccountPda({
            config: accounts.config,
            principalTokenProgram: accounts.principalTokenProgram,
            principalMint: accounts.principalMint,
        });
        protocolFeeTokenAccount = derived;
    }
    let eventAuthority = accounts.eventAuthority;
    if (!eventAuthority) {
        const [derived] = await findEventAuthorityPda(programId);
        eventAuthority = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.signerUser, isSigner: false, isWritable: false },
        { pubkey: accounts.lender, isSigner: false, isWritable: false },
        { pubkey: accounts.lenderUser, isSigner: false, isWritable: false },
        { pubkey: accounts.loan, isSigner: false, isWritable: true },
        { pubkey: accounts.config, isSigner: false, isWritable: false },
        { pubkey: accounts.principalMint, isSigner: false, isWritable: false },
        { pubkey: accounts.signerPrincipalTokenAccount, isSigner: false, isWritable: true },
        { pubkey: lenderPrincipalEscrow, isSigner: false, isWritable: true },
        { pubkey: protocolFeeTokenAccount, isSigner: false, isWritable: true },
        { pubkey: accounts.principalTokenProgram, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: accounts.program, isSigner: false, isWritable: false },
    ];
    let data = Buffer.alloc(0);
    data = Buffer.concat([
        data.subarray(0, 0),
        Buffer.alloc(Math.max(0, 0 - data.length)),
        Buffer.from(EXTEND_LOAN_INSTRUCTION_DISCRIMINATOR),
        data.subarray(0),
    ]);

    return new TransactionInstruction({ keys, programId, data });
}
