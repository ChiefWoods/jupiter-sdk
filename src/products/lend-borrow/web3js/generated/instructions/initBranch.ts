import { AccountMeta, Address, Keypair, TransactionInstruction } from '@solana/web3.js';
import { VAULTS_PROGRAM_ID } from '..';
import { findBranchPda } from '../pdas/branch';
import { getStructEncoder, getU16Encoder, getU32Encoder, type Encoder } from '@solana/codecs';

export interface InitBranchInstructionAccounts {
    signer: Address;
    vaultConfig: Address;
    branch?: Address;
    systemProgram: Address;
}

export interface InitBranchInstructionArgs {
    vaultId: number;
    branchId: number;
}

function getInitBranchInstructionDataEncoder(): Encoder<InitBranchInstructionArgs> {
    return getStructEncoder([
        ['vaultId', getU16Encoder()],
        ['branchId', getU32Encoder()],
    ]);
}

export async function createInitBranchInstruction(
    accounts: InitBranchInstructionAccounts,
    args: InitBranchInstructionArgs,
    programId: Address = VAULTS_PROGRAM_ID,
): Promise<TransactionInstruction> {
    let branch = accounts.branch;
    if (!branch) {
        const [derived] = await findBranchPda(
            {
                vaultId: args.vaultId,
                branchId: args.branchId,
            },
            programId,
        );
        branch = derived;
    }
    const keys: AccountMeta[] = [
        { pubkey: accounts.signer, isSigner: true, isWritable: true },
        { pubkey: accounts.vaultConfig, isSigner: false, isWritable: false },
        { pubkey: branch, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    const instructionData = Buffer.from(getInitBranchInstructionDataEncoder().encode(args));
    const discriminator = Buffer.from('a25b3917e45d6f15', 'hex');
    const data = Buffer.concat([discriminator, instructionData]);

    return new TransactionInstruction({ keys, programId, data });
}
