import { Address } from '@solana/web3.js';
import { OFFERBOOK_PROGRAM_ID } from '../programs/offerbook';

export interface LoanVaultPdaSeeds {
    loan: Address;
}

export async function findLoanVaultPda(
    seeds: LoanVaultPdaSeeds,
    programId: Address = OFFERBOOK_PROGRAM_ID,
): Promise<[Address, number]> {
    const seedsBuffer: Uint8Array[] = [Buffer.from('loan_vault', 'utf8'), seeds.loan.toBytes()];
    return await Address.findProgramAddress(seedsBuffer, programId);
}
